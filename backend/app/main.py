import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import User, Pharmacy
from .routes import (
    auth_routes,
    dashboard_routes,
    signals_routes,
    pharmacies_routes,
    analytics_routes,
    inventory_routes,
    reports_routes,
    notifications_routes,
    ml_routes
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PharmaPulse — AI-Powered Pharmacy Spike Tracker API",
    description=(
        "Public health early-warning decision-support intelligence platform for detecting "
        "medicine demand spikes using aggregated, non-PII pharmacy transaction data. "
        "Smart India Hackathon (SIH) Prototype."
    ),
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(signals_routes.router)
app.include_router(pharmacies_routes.router)
app.include_router(analytics_routes.router)
app.include_router(inventory_routes.router)
app.include_router(reports_routes.router)
app.include_router(notifications_routes.router)
app.include_router(ml_routes.router)

@app.get("/")
def root():
    return {
        "project": "PharmaPulse — AI-Powered Pharmacy Spike Tracker",
        "purpose": "Decision-support & early-warning intelligence (SIH Prototype)",
        "disclaimer": "The application is a decision-support and early-warning system, NOT a medical diagnosis system. Potential anomaly detected — verification recommended.",
        "data_classification": "Synthetic Demo Data — No PII Collected",
        "documentation": "/docs"
    }

@app.on_event("startup")
def startup_event():
    # Automatically verify and seed database if empty
    from .database import SessionLocal
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        pharmacy_count = db.query(Pharmacy).count()
        if user_count == 0 or pharmacy_count == 0:
            import logging
            logging.info("Database appears unseeded. Running seed script...")
            from ..seed import seed_all
            seed_all(db)
    except Exception as e:
        print(f"Startup check warning: {e}")
    finally:
        db.close()
