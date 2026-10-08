import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Date
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="Analyst")  # Admin, Health Officer, Pharmacy, Analyst
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reviews = relationship("SignalReview", back_populates="reviewer")
    reports = relationship("Report", back_populates="author")


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # e.g., PH-001
    name = Column(String(255), nullable=False)
    zone = Column(String(100), nullable=False, index=True)  # e.g., Zone 1, Zone 4
    address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    contact_person = Column(String(255), default="Pharmacist")
    phone = Column(String(50), default="+91-9876543210")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sales_records = relationship("SalesData", back_populates="pharmacy", cascade="all, delete-orphan")
    inventory_items = relationship("Inventory", back_populates="pharmacy", cascade="all, delete-orphan")


class MedicineCategory(Base):
    __tablename__ = "medicine_categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)  # Respiratory, Fever, Pain Relief, etc.
    description = Column(String(500))
    priority_level = Column(String(20), default="NORMAL")  # HIGH, MEDIUM, NORMAL

    sales_records = relationship("SalesData", back_populates="category")
    inventory_items = relationship("Inventory", back_populates="category")


class SalesData(Base):
    __tablename__ = "sales_data"

    id = Column(Integer, primary_key=True, index=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("medicine_categories.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    zone = Column(String(100), nullable=False, index=True)
    category_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    expected_quantity = Column(Float, default=0.0)
    stock_level = Column(Integer, default=100)  # percentage e.g., 64%
    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    pharmacy = relationship("Pharmacy", back_populates="sales_records")
    category = relationship("MedicineCategory", back_populates="sales_records")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("medicine_categories.id"), nullable=False, index=True)
    category_name = Column(String(100), nullable=False)
    current_stock = Column(Integer, nullable=False, default=100)
    minimum_stock = Column(Integer, nullable=False, default=50)
    stock_level_pct = Column(Integer, default=100)
    supply_risk = Column(String(20), default="LOW")  # LOW, MEDIUM, HIGH
    demand_trend_pct = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    pharmacy = relationship("Pharmacy", back_populates="inventory_items")
    category = relationship("MedicineCategory", back_populates="inventory_items")


class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)  # e.g., "Respiratory Medicine Demand Spike"
    area = Column(String(100), nullable=False, index=True)  # e.g., "Zone 4"
    category = Column(String(100), nullable=False)  # "Respiratory"
    demand_change_pct = Column(Float, nullable=False)  # e.g., 87.0
    baseline_demand = Column(Float, default=120.0)
    current_demand = Column(Float, default=224.0)
    duration_days = Column(Integer, default=4)
    pharmacies_affected = Column(Integer, default=14)
    risk_score = Column(Float, nullable=False)  # 0 to 100
    severity = Column(String(50), nullable=False)  # NORMAL, WATCH, ALERT, HIGH_SIGNAL
    status = Column(String(50), default="UNREVIEWED")  # UNREVIEWED, REVIEWED, INVESTIGATING, DISMISSED
    z_score = Column(Float, default=3.2)
    spike_magnitude_score = Column(Float, default=35.0)
    time_persistence_score = Column(Float, default=25.0)
    geographic_concentration_score = Column(Float, default=20.0)
    cross_category_score = Column(Float, default=20.0)
    related_categories = Column(String(255), default="Cough/Cold, Fever")
    explanation = Column(Text, nullable=False)
    recommendation = Column(Text, default="Potential anomaly detected — verification recommended with public health data.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    reviews = relationship("SignalReview", back_populates="signal", cascade="all, delete-orphan")


class SignalReview(Base):
    __tablename__ = "signal_reviews"

    id = Column(Integer, primary_key=True, index=True)
    signal_id = Column(Integer, ForeignKey("signals.id"), nullable=False)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_status = Column(String(50), nullable=False)  # REVIEWED, INVESTIGATING, DISMISSED
    notes = Column(Text, default="")
    assigned_to_officer = Column(String(255), default="")
    reviewed_at = Column(DateTime, default=datetime.datetime.utcnow)

    signal = relationship("Signal", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="HIGH_SIGNAL")  # HIGH_SIGNAL, ANOMALY, SUPPLY_PRESSURE, SYSTEM
    zone = Column(String(100), default="Zone 4")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    zone = Column(String(100), default="All Zones")
    category = Column(String(100), default="All Categories")
    date_range = Column(String(100), default="Last 30 Days")
    executive_summary = Column(Text, nullable=False)
    risk_score = Column(Float, default=75.0)
    report_data = Column(Text, nullable=False)  # Serialized JSON structure
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    author = relationship("User", back_populates="reports")
