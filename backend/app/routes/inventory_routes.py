from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.data_service import get_inventory_summary

router = APIRouter(prefix="/api/inventory", tags=["Inventory & Supply Pressure"])

@router.get("")
def get_inventory_status(db: Session = Depends(get_db)):
    summary = get_inventory_summary(db)

    # Format chart data comparing Demand Surge vs Stock Level
    chart_data = []
    for item in summary:
        chart_data.append({
            "category": item["category_name"],
            "demand_trend": item["demand_change_pct"],
            "stock_level": item["average_stock_level_pct"],
            "stock_deficit": max(0, 100 - item["average_stock_level_pct"]),
            "supply_risk": item["supply_risk"]
        })

    return {
        "categories": summary,
        "chart_data": chart_data,
        "disclaimer": "Potential supply pressure detected does not automatically confirm clinical shortage. Verification recommended with state medical logistics coordinators."
    }
