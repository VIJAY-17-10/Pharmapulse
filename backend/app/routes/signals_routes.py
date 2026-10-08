from typing import List, Optional
import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Signal, SignalReview, User, Notification
from ..schemas import SignalResponse, SignalReviewRequest, SignalAssignRequest, SignalNoteRequest

router = APIRouter(prefix="/api/signals", tags=["Signals & Early Warning"])

@router.get("", response_model=List[SignalResponse])
def get_signals(
    severity: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    zone: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Signal)
    
    if severity and severity != "All":
        query = query.filter(Signal.severity == severity.upper().replace(" ", "_"))
    
    if status_filter and status_filter != "All":
        if status_filter == "Reviewed":
            query = query.filter(Signal.status.in_(["REVIEWED", "INVESTIGATING"]))
        elif status_filter == "Unreviewed":
            query = query.filter(Signal.status == "UNREVIEWED")
        else:
            query = query.filter(Signal.status == status_filter.upper())
            
    if zone and zone != "All Zones":
        query = query.filter(Signal.area == zone)
        
    if category and category != "All Categories":
        query = query.filter(Signal.category == category)
        
    return query.order_by(Signal.risk_score.desc()).all()

@router.get("/{signal_id}")
def get_signal_detail(signal_id: int, db: Session = Depends(get_db)):
    sig = db.query(Signal).filter(Signal.id == signal_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found")
        
    reviews = db.query(SignalReview).filter(SignalReview.signal_id == signal_id).all()

    # Form explainable AI structure
    explanation_details = {
        "signal_id": sig.id,
        "title": sig.title,
        "area": sig.area,
        "category": sig.category,
        "risk_score": sig.risk_score,
        "severity": sig.severity,
        "status": sig.status,
        "metrics": {
            "demand_spike_pct": sig.demand_change_pct,
            "historical_deviation_z": f"{sig.z_score:.1f}σ",
            "duration": f"{sig.duration_days} consecutive days",
            "pharmacies_affected": sig.pharmacies_affected,
            "related_categories": sig.related_categories,
            "geographic_concentration": "High" if sig.pharmacies_affected >= 10 else "Moderate"
        },
        "score_breakdown": {
            "spike_magnitude": {
                "weight_pct": 35,
                "score_contribution": sig.spike_magnitude_score,
                "label": "Spike Magnitude"
            },
            "time_persistence": {
                "weight_pct": 25,
                "score_contribution": sig.time_persistence_score,
                "label": "Time Persistence"
            },
            "geographic_concentration": {
                "weight_pct": 20,
                "score_contribution": sig.geographic_concentration_score,
                "label": "Geographic Pattern"
            },
            "cross_category_correlation": {
                "weight_pct": 20,
                "score_contribution": sig.cross_category_score,
                "label": "Cross-category Link"
            }
        },
        "formula": "Risk Score = 0.35 × Spike Magnitude + 0.25 × Time Persistence + 0.20 × Geographic Concentration + 0.20 × Cross-category Correlation",
        "baseline_demand": sig.baseline_demand,
        "current_demand": sig.current_demand,
        "narrative": sig.explanation,
        "recommendation": sig.recommendation,
        "disclaimer": "CRITICAL NOTICE: The application is a decision-support and early-warning system, NOT a medical diagnosis system. Never claim that a medicine spike confirms an outbreak. Potential anomaly detected — verification recommended.",
        "created_at": sig.created_at,
        "reviews": reviews
    }
    return explanation_details

@router.post("/{signal_id}/review")
def review_signal(
    signal_id: int,
    payload: SignalReviewRequest,
    db: Session = Depends(get_db)
):
    sig = db.query(Signal).filter(Signal.id == signal_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found")
        
    sig.status = payload.review_status.upper()
    sig.updated_at = datetime.datetime.utcnow()

    review = SignalReview(
        signal_id=signal_id,
        review_status=payload.review_status.upper(),
        notes=payload.notes or "Signal verified by authorized health officer.",
        assigned_to_officer=payload.assigned_to_officer or "",
        reviewed_at=datetime.datetime.utcnow()
    )
    db.add(review)

    # Add audit notification
    notif = Notification(
        title=f"Signal #{signal_id} Marked {sig.status}",
        message=f"{sig.title} in {sig.area} was reviewed. Notes: {payload.notes or 'No notes provided'}",
        type="SYSTEM",
        zone=sig.area
    )
    db.add(notif)
    db.commit()
    db.refresh(sig)

    return {"success": True, "message": "Signal updated successfully", "status": sig.status}

@router.post("/{signal_id}/assign")
def assign_signal(
    signal_id: int,
    payload: SignalAssignRequest,
    db: Session = Depends(get_db)
):
    sig = db.query(Signal).filter(Signal.id == signal_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signal not found")

    sig.status = "INVESTIGATING"
    review = SignalReview(
        signal_id=signal_id,
        review_status="INVESTIGATING",
        notes=payload.notes or f"Assigned to {payload.assigned_to_officer} for field verification.",
        assigned_to_officer=payload.assigned_to_officer,
        reviewed_at=datetime.datetime.utcnow()
    )
    db.add(review)
    db.commit()

    return {"success": True, "message": f"Signal assigned to {payload.assigned_to_officer}"}
