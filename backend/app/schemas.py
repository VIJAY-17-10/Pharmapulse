from typing import List, Optional, Any, Dict
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field

# --- Auth & User Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Pharmacy & Category Schemas ---
class PharmacyBase(BaseModel):
    code: str
    name: str
    zone: str
    address: str
    latitude: float
    longitude: float
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True

class PharmacyResponse(PharmacyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MedicineCategoryResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    priority_level: str

    class Config:
        from_attributes = True

# --- Sales Data Schemas ---
class SalesDataBase(BaseModel):
    pharmacy_id: int
    category_id: int
    date: date
    zone: str
    category_name: str
    quantity: int
    expected_quantity: float = 0.0
    stock_level: int = 100
    is_anomaly: bool = False
    anomaly_score: float = 0.0

class SalesDataCreate(BaseModel):
    pharmacy_code: str
    date: str
    zone: str
    category: str
    quantity: int
    stock_level: int = 100

class SalesDataResponse(BaseModel):
    id: int
    pharmacy_id: int
    pharmacy_code: Optional[str] = None
    date: date
    zone: str
    category_name: str
    quantity: int
    expected_quantity: float
    stock_level: int
    is_anomaly: bool
    anomaly_score: float

    class Config:
        from_attributes = True

class CSVUploadResponse(BaseModel):
    success: bool
    message: str
    records_processed: int
    anomalies_detected: int
    new_signals_generated: int
    preview_data: List[Dict[str, Any]]
    signals: List[Dict[str, Any]] = []

# --- Signal Schemas ---
class SignalBase(BaseModel):
    title: str
    area: str
    category: str
    demand_change_pct: float
    baseline_demand: float
    current_demand: float
    duration_days: int
    pharmacies_affected: int
    risk_score: float
    severity: str
    status: str
    z_score: float
    spike_magnitude_score: float
    time_persistence_score: float
    geographic_concentration_score: float
    cross_category_score: float
    related_categories: str
    explanation: str
    recommendation: str

class SignalReviewResponse(BaseModel):
    id: int
    signal_id: int
    reviewed_by: Optional[int] = None
    reviewer_name: Optional[str] = None
    review_status: str
    notes: Optional[str] = ""
    assigned_to_officer: Optional[str] = ""
    reviewed_at: datetime

    class Config:
        from_attributes = True

class SignalResponse(SignalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    reviews: List[SignalReviewResponse] = []

    class Config:
        from_attributes = True

class SignalReviewRequest(BaseModel):
    review_status: str = "REVIEWED"  # REVIEWED, INVESTIGATING, DISMISSED
    notes: Optional[str] = ""
    assigned_to_officer: Optional[str] = ""

class SignalAssignRequest(BaseModel):
    assigned_to_officer: str
    notes: Optional[str] = ""

class SignalNoteRequest(BaseModel):
    notes: str

# --- Inventory Schemas ---
class InventoryResponse(BaseModel):
    id: int
    pharmacy_id: int
    pharmacy_code: Optional[str] = None
    zone: Optional[str] = None
    category_id: int
    category_name: str
    current_stock: int
    minimum_stock: int
    stock_level_pct: int
    supply_risk: str  # LOW, MEDIUM, HIGH
    demand_trend_pct: float
    last_updated: datetime

    class Config:
        from_attributes = True

class InventoryCategorySummary(BaseModel):
    category_name: str
    total_stock: int
    average_stock_level_pct: int
    demand_change_pct: float
    stock_change_pct: float
    supply_risk: str  # LOW, MEDIUM, HIGH
    potential_supply_pressure: bool
    affected_zones: List[str]

# --- Dashboard & Analytics Schemas ---
class KpiCardData(BaseModel):
    title: str
    value: Any
    trend_pct: float
    trend_label: str
    description: str
    subtext: Optional[str] = None

class DashboardKpis(BaseModel):
    active_signals: KpiCardData
    critical_signals: KpiCardData
    pharmacies_monitored: KpiCardData
    areas_monitored: KpiCardData
    detection_accuracy: KpiCardData
    average_detection_time: KpiCardData

class TrendPoint(BaseModel):
    date: str
    category: str
    actual_demand: float
    expected_demand: float
    deviation_pct: float
    is_anomaly: bool

class DashboardResponse(BaseModel):
    kpis: DashboardKpis
    recent_signals: List[SignalResponse]
    trends: List[TrendPoint]
    active_notifications_count: int

# --- Map Schemas ---
class ZoneMapSignal(BaseModel):
    zone: str
    latitude: float
    longitude: float
    pharmacies_count: int
    active_signals_count: int
    status: str  # Normal, Watch, Alert, High Signal
    risk_score: float
    top_affected_category: str
    demand_change_pct: float
    latest_signal_id: Optional[int] = None
    signal_title: Optional[str] = None

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    zone: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Report Schemas ---
class ReportGenerateRequest(BaseModel):
    zone: str = "All Zones"
    category: str = "All Categories"
    date_range: str = "Last 30 Days"

class ReportResponse(BaseModel):
    id: int
    title: str
    zone: str
    category: str
    date_range: str
    executive_summary: str
    risk_score: float
    report_data: Dict[str, Any]
    generated_by: Optional[int] = None
    created_at: datetime
