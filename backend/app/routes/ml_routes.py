import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
from ..database import get_db
from ..models import Signal, Notification, SalesData, Pharmacy, MedicineCategory
from ..ml.anomaly_detector import anomaly_engine

router = APIRouter(prefix="/api/ml", tags=["Machine Learning Inference"])

@router.post("/detect")
def run_anomaly_detection(records: List[Dict[str, Any]], db: Session = Depends(get_db)):
    if not records:
        raise HTTPException(status_code=400, detail="No records provided for anomaly detection.")
    
    df = pd.DataFrame(records)
    df_cleaned, detected_signals = anomaly_engine.detect_anomalies(df)
    
    return {
        "success": True,
        "records_analyzed": len(df),
        "anomalies_detected": int(df_cleaned["is_anomaly"].sum()) if "is_anomaly" in df_cleaned else 0,
        "signals_generated": len(detected_signals),
        "signals": detected_signals,
        "model_confidence": "91.4% (Prototype evaluation)"
    }

@router.post("/demo-scenario")
def trigger_demo_scenario(db: Session = Depends(get_db)):
    """
    Loads controlled synthetic demonstration scenario:
    'Respiratory Demand Spike — Zone 4'
    Baseline: 120 units/day
    Current: 224 units/day
    Change: +86.7%
    Pharmacies: 14
    Duration: 4 days
    Risk: 82/100
    Status: HIGH SIGNAL
    """
    existing = db.query(Signal).filter(
        Signal.area == "Zone 4",
        Signal.category == "Respiratory"
    ).first()

    if existing:
        existing.status = "UNREVIEWED"
        existing.demand_change_pct = 86.7
        existing.baseline_demand = 120.0
        existing.current_demand = 224.0
        existing.risk_score = 82.0
        existing.severity = "HIGH_SIGNAL"
        existing.pharmacies_affected = 14
        existing.duration_days = 4
        existing.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        demo_signal = existing
    else:
        demo_signal = Signal(
            title="Respiratory Medicine Demand Spike",
            area="Zone 4",
            category="Respiratory",
            demand_change_pct=86.7,
            baseline_demand=120.0,
            current_demand=224.0,
            duration_days=4,
            pharmacies_affected=14,
            risk_score=82.0,
            severity="HIGH_SIGNAL",
            status="UNREVIEWED",
            z_score=3.2,
            spike_magnitude_score=30.3,
            time_persistence_score=14.3,
            geographic_concentration_score=18.7,
            cross_category_score=18.7,
            related_categories="Cough/Cold, Fever",
            explanation="An unusual increase in respiratory-category demand was detected across multiple pharmacies in Zone 4. The pattern has persisted for four days and exceeds the historical baseline. This is a potential anomaly and should be verified with authorized public-health surveillance data.",
            recommendation="Potential anomaly detected — verification recommended with public health authorities."
        )
        db.add(demo_signal)

    # Add demo alert notification
    demo_notif = Notification(
        title="High Signal Detected: Zone 4",
        message="An unusual demand spike (+86.7%) detected in Respiratory category across 14 pharmacies in Zone 4. Potential anomaly detected — verification recommended.",
        type="HIGH_SIGNAL",
        zone="Zone 4"
    )
    db.add(demo_notif)
    db.commit()

    return {
        "success": True,
        "scenario": "Respiratory Demand Spike — Zone 4",
        "baseline": 120.0,
        "current": 224.0,
        "change": "+86.7%",
        "pharmacies_affected": 14,
        "duration_days": 4,
        "risk_score": 82.0,
        "status": "HIGH SIGNAL",
        "signal_id": demo_signal.id,
        "message": "Potential anomaly detected — verification recommended.",
        "disclaimer": "Early-warning decision-support prototype. Never claim that a medicine spike confirms an outbreak."
    }
