# meddoc / PharmaPulse — AI-Powered Pharmacy Spike Tracker

> **Smart India Hackathon (SIH) Prototype**  
> *A Privacy-First Public Health Decision-Support & Early-Warning Intelligence System*

---

## ⚠️ Important Disclaimer & Public Health Ethics

> **DECISION SUPPORT SYSTEM — NOT A DIAGNOSTIC TOOL**  
> This platform is strictly an **early-warning decision-support system** for public health authorities and surveillance epidemiologists.  
> - **Never interprets a pharmacy demand spike as confirmed disease etiology or outbreak verification.**  
> - Anomalies are flagged with standard phrasing: *"Potential anomaly detected — verification recommended."*  
> - **100% Zero-PII Guarantee:** The platform operates exclusively on aggregated, non-identifiable pharmacy OTC/prescription volume logs. No patient names, phone numbers, addresses, or clinical records are collected, stored, or processed.

---

## 🌟 Key Features

1. **Executive Surveillance Dashboard**
   - 6 Live Public Health KPI Cards: Active Signals, Critical Signals, Monitored Pharmacies, Tracked Zones, Detection Accuracy, and Early-Warning Detection Latency.
   - Interactive multi-category baseline vs. actual sales deviation line charts.
   - Live AI anomaly signals feed sorted by composite risk score.

2. **Signals & Triage Workflow**
   - Multi-tier alert classification: `NORMAL`, `WATCH`, `ALERT`, `HIGH_SIGNAL`.
   - Actionable signal inspection with historical demand, Z-score, and related category surge correlation.
   - Officer assignment, review notes logging, and field verification triage status tracking (`UNREVIEWED`, `INVESTIGATING`, `REVIEWED`, `DISMISSED`).

3. **Explainable AI (XAI) & Mathematical Decomposition**
   - Complete transparency behind every generated alert.
   - Composite Anomaly Score Formula:
     $$\text{Risk Score} = 0.35 \times \text{Spike Magnitude} + 0.25 \times \text{Persistence} + 0.20 \times \text{Geographic Concentration} + 0.20 \times \text{Cross-Category Correlation}$$
   - SHAP-style visual score contribution bars and statistical Z-score baseline breakdown.

4. **Geographic Risk Heatmap**
   - Interactive zone map showing pharmacy density, active anomalies, risk level pins, and affected medicine categories.

5. **Aggregated Pharmacy Ingestion & CSV Import**
   - Searchable, filterable pharmacy sales telemetry table.
   - Zero-PII CSV batch upload modal with sample CSV download and validation.

6. **Supply Chain & Inventory Risk Assessment**
   - Category-level stockout pressure tracking and supply elasticity estimation to prevent medicine shortages.

7. **Automated Intelligence Reports**
   - Exportable public health summary reports and executive briefings.

8. **Live Demo Scenario Generator**
   - 1-click synthetic multi-pharmacy outbreak simulation to demonstrate live detection and real-time alerts.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet / React-Leaflet
- **Backend:** Python 3, FastAPI, SQLAlchemy, SQLite, Pydantic, Scikit-learn
- **Environment:** Portable Node.js + Python

---

## 🚀 How to Run in VS Code

### Option 1: 1-Click Launch Script (Recommended)
Double-click or run from terminal:
```powershell
.\pharmapulse\start.ps1
```
or on Windows Command Prompt:
```cmd
pharmapulse\start.bat
```

### Option 2: Manual Terminal Commands

1. **Start Backend Server:**
   ```powershell
   cd pharmapulse\backend
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *Swagger API Docs:* [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

2. **Start Frontend Dev Server:**
   ```powershell
   cd pharmapulse\frontend
   $env:PATH = "C:\Users\ELCOT\nodejs;" + $env:PATH
   npm run dev
   ```
   *Application UI:* [http://localhost:5173/](http://localhost:5173/)

---

## 👥 Demo Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Health Officer (Default)** | `officer@health.gov.in` | `officer123` |
| **Analyst** | `analyst@health.gov.in` | `analyst123` |
| **Admin** | `admin@health.gov.in` | `admin123` |

*(Note: Clicking the "Quick Demo Login" button on the login screen logs in automatically with full officer privileges)*
