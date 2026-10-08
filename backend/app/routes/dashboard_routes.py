from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Signal, Notification
from ..services.data_service import get_dashboard_kpis, get_demand_trends

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_data(db: Session = Depends(get_db)):
    kpis = get_dashboard_kpis(db)
    
    # Recent unreviewed signals
    recent_signals = (
        db.query(Signal)
        .filter(Signal.status != "DISMISSED")
        .order_by(Signal.risk_score.desc())
        .limit(6)
        .all()
    )

    # 30-day baseline trend
    trends = get_demand_trends(db, days=30, category_name="Respiratory")
    unread_notifications = db.query(Notification).filter(Notification.is_read == False).count()

    return {
        "kpis": kpis,
        "recent_signals": recent_signals,
        "trends": trends,
        "unread_notifications": unread_notifications,
        "disclaimer": "PharmaPulse is an early-warning decision-support prototype. A detected demand anomaly does not confirm disease, outbreak, or causation. Signals require validation using authorized public-health and clinical data."
    }
