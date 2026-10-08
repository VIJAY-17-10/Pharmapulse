import io
import datetime
from typing import Optional, List, Dict, Any
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from ..database import get_db
from ..models import Pharmacy, MedicineCategory, SalesData, Signal, Notification
from ..schemas import CSVUploadResponse
from ..ml.anomaly_detector import anomaly_engine

router = APIRouter(prefix="/api/pharmacies", tags=["Pharmacies & Data Ingestion"])

@router.get("")
def get_pharmacies(zone: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Pharmacy)
    if zone and zone != "All Zones":
        query = query.filter(Pharmacy.zone == zone)
    pharmacies = query.all()
    return pharmacies

@router.get("/data")
def get_pharmacy_sales_table(
    page: int = 1,
    limit: int = 15,
    zone: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "date",
    order: str = "desc",
    db: Session = Depends(get_db)
):
    query = db.query(SalesData).join(Pharmacy, SalesData.pharmacy_id == Pharmacy.id)

    if zone and zone != "All Zones":
        query = query.filter(SalesData.zone == zone)

    if category and category != "All Categories":
        query = query.filter(SalesData.category_name == category)

    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Pharmacy.code.ilike(search_fmt)) |
            (Pharmacy.name.ilike(search_fmt)) |
            (SalesData.zone.ilike(search_fmt)) |
            (SalesData.category_name.ilike(search_fmt))
        )

    # Sorting
    sort_column = getattr(SalesData, sort_by, SalesData.date)
    if order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))

    total_count = query.count()
    offset = (page - 1) * limit
    records = query.offset(offset).limit(limit).all()

    formatted_records = []
    for r in records:
        # Determine status display (Normal, Watch, Alert, High Signal)
        if r.anomaly_score >= 3.0 or r.quantity > r.expected_quantity * 1.6:
            st = "Alert"
        elif r.anomaly_score >= 2.0 or r.quantity > r.expected_quantity * 1.3:
            st = "Watch"
        else:
            st = "Normal"

        formatted_records.append({
            "id": r.id,
            "pharmacy_code": r.pharmacy.code if r.pharmacy else f"PH-{r.pharmacy_id:03d}",
            "pharmacy_name": r.pharmacy.name if r.pharmacy else "Community Pharmacy",
            "zone": r.zone,
            "date": str(r.date),
            "category": r.category_name,
            "quantity": r.quantity,
            "expected_quantity": r.expected_quantity,
            "stock_level": f"{r.stock_level}%",
            "raw_stock_level": r.stock_level,
            "status": st,
            "is_anomaly": r.is_anomaly,
            "anomaly_score": r.anomaly_score
        })

    return {
        "records": formatted_records,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total_count + limit - 1) // limit)
    }

@router.get("/sample-csv")
def download_sample_csv():
    """Generates a downloadable synthetic template CSV for immediate testing"""
    csv_content = (
        "date,pharmacy_id,zone,category,quantity,stock_level\n"
        "2026-10-07,PH-001,Zone 4,Respiratory,195,35\n"
        "2026-10-07,PH-002,Zone 4,Respiratory,210,28\n"
        "2026-10-07,PH-003,Zone 4,Respiratory,188,40\n"
        "2026-10-07,PH-004,Zone 4,Respiratory,230,22\n"
        "2026-10-07,PH-005,Zone 4,Respiratory,205,31\n"
        "2026-10-07,PH-001,Zone 4,Cough/Cold,170,45\n"
        "2026-10-07,PH-002,Zone 4,Cough/Cold,165,50\n"
        "2026-10-07,PH-010,Zone 1,Fever,92,85\n"
        "2026-10-07,PH-011,Zone 1,Fever,88,90\n"
        "2026-10-07,PH-012,Zone 2,Digestive,145,55\n"
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=pharmapulse_sample_demand.csv"}
    )

@router.post("/upload", response_model=CSVUploadResponse)
async def upload_pharmacy_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .csv file.")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    # Required columns validation
    required_cols = {"date", "pharmacy_id", "zone", "category", "quantity", "stock_level"}
    clean_cols = {c.strip().lower() for c in df.columns}
    missing = required_cols - clean_cols
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns in CSV: {', '.join(missing)}. Required columns: date, pharmacy_id, zone, category, quantity, stock_level"
        )

    # Standardize column names
    df.columns = [c.strip().lower() for c in df.columns]
    df["category_name"] = df["category"]

    # Fill default pharmacy_id foreign keys if codes like 'PH-001' are provided
    pharmacy_map = {p.code: p.id for p in db.query(Pharmacy).all()}
    if not pharmacy_map:
        # Fallback numeric id
        df["pharmacy_db_id"] = 1
    else:
        df["pharmacy_db_id"] = df["pharmacy_id"].apply(
            lambda x: pharmacy_map.get(str(x).strip(), list(pharmacy_map.values())[0])
        )

    df_cleaned, detected_signals = anomaly_engine.detect_anomalies(df)

    # Save anomalies & signals to database
    anomalies_count = int(df_cleaned["is_anomaly"].sum())
    new_signals_count = 0

    for sig_data in detected_signals:
        new_sig = Signal(
            title=sig_data["title"],
            area=sig_data["zone"],
            category=sig_data["category"],
            demand_change_pct=sig_data["demand_change"],
            baseline_demand=sig_data["baseline_demand"],
            current_demand=sig_data["current_demand"],
            duration_days=sig_data["duration_days"],
            pharmacies_affected=sig_data["pharmacies_affected"],
            risk_score=sig_data["risk_score"],
            severity=sig_data["severity"],
            status="UNREVIEWED",
            z_score=sig_data["z_score"],
            spike_magnitude_score=sig_data["score_breakdown"]["spike_magnitude"],
            time_persistence_score=sig_data["score_breakdown"]["time_persistence"],
            geographic_concentration_score=sig_data["score_breakdown"]["geographic_concentration"],
            cross_category_score=sig_data["score_breakdown"]["cross_category"],
            related_categories=sig_data["related_categories"],
            explanation=sig_data["explanation"],
            recommendation=sig_data["recommendation"]
        )
        db.add(new_sig)
        new_signals_count += 1

        # Notification
        notif = Notification(
            title=f"AI Signal Generated: {sig_data['title']} ({sig_data['zone']})",
            message=f"Spike of +{sig_data['demand_change']}% detected. Risk score: {sig_data['risk_score']}/100. Verification recommended.",
            type=sig_data["severity"],
            zone=sig_data["zone"]
        )
        db.add(notif)

    db.commit()

    # Create top 5 preview records
    preview = df_cleaned.head(5).to_dict(orient="records")

    return CSVUploadResponse(
        success=True,
        message=f"CSV successfully processed! {len(df)} records ingested.",
        records_processed=len(df),
        anomalies_detected=anomalies_count,
        new_signals_generated=new_signals_count,
        preview_data=preview,
        signals=detected_signals
    )
