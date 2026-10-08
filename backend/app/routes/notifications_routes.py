from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Notification
from ..schemas import NotificationResponse

router = APIRouter(prefix="/api/notifications", tags=["Notification Center"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(desc(Notification.created_at)).limit(20).all()

@router.post("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"success": True, "message": "Marked as read"}

@router.post("/mark-all-read")
def mark_all_notifications_read(db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.is_read == False).update({"is_read": True})
    db.commit()
    return {"success": True, "message": "All notifications marked as read"}
