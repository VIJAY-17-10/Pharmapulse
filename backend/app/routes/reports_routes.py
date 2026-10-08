import json
import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Report
from ..schemas import ReportGenerateRequest, ReportResponse
from ..services.data_service import generate_report_content

router = APIRouter(prefix="/api/reports", tags=["Reports & Export"])

@router.get("", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(desc(Report.created_at)).all()
    # parse JSON string for response model
    out = []
    for r in reports:
        out.append(ReportResponse(
            id=r.id,
            title=r.title,
            zone=r.zone,
            category=r.category,
            date_range=r.date_range,
            executive_summary=r.executive_summary,
            risk_score=r.risk_score,
            report_data=json.loads(r.report_data) if isinstance(r.report_data, str) else r.report_data,
            generated_by=r.generated_by,
            created_at=r.created_at
        ))
    return out

@router.post("/generate", response_model=ReportResponse)
def generate_report(payload: ReportGenerateRequest, db: Session = Depends(get_db)):
    content = generate_report_content(
        db,
        zone=payload.zone,
        category=payload.category,
        date_range=payload.date_range
    )

    report_model = Report(
        title=content["title"],
        zone=payload.zone,
        category=payload.category,
        date_range=payload.date_range,
        executive_summary=content["executive_summary"],
        risk_score=content["max_risk_score"],
        report_data=json.dumps(content),
        created_at=datetime.datetime.utcnow()
    )
    db.add(report_model)
    db.commit()
    db.refresh(report_model)

    return ReportResponse(
        id=report_model.id,
        title=report_model.title,
        zone=report_model.zone,
        category=report_model.category,
        date_range=report_model.date_range,
        executive_summary=report_model.executive_summary,
        risk_score=report_model.risk_score,
        report_data=content,
        generated_by=report_model.generated_by,
        created_at=report_model.created_at
    )
