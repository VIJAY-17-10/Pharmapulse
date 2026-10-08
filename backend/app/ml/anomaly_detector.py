"""
PharmaPulse AI/ML Anomaly Detection Service
Smart India Hackathon (SIH) Prototype Engine

IMPORTANT NOTICE:
PharmaPulse is a public-health decision-support and early-warning intelligence system,
NOT a medical diagnosis system. A detected demand anomaly never confirms disease,
outbreak, or causation. All signals indicate:
"Potential anomaly detected — verification recommended."
These thresholds are prototype parameters and require validation before real-world deployment.
"""

from typing import List, Dict, Any, Tuple
import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# Category co-occurrence mappings for cross-category correlation evaluation
CORRELATED_CATEGORIES = {
    "Respiratory": ["Cough/Cold", "Fever", "Antibiotic"],
    "Fever": ["Pain Relief", "Respiratory", "Cough/Cold"],
    "Digestive": ["ORS/Hydration", "Antacid", "Antibiotic"],
    "ORS/Hydration": ["Digestive", "Antacid"],
    "Cough/Cold": ["Respiratory", "Fever"],
    "Pain Relief": ["Fever"],
    "Allergy": ["Respiratory", "Dermatological"],
    "Dermatological": ["Allergy"],
    "Antibiotic": ["Respiratory", "Digestive", "Fever"],
    "Antacid": ["Digestive"]
}

class AnomalyDetector:
    def __init__(self, moving_avg_window: int = 7, zscore_threshold: float = 2.5, contamination: float = 0.05):
        self.moving_avg_window = moving_avg_window
        self.zscore_threshold = zscore_threshold
        self.contamination = contamination

    def calculate_baseline(self, series: pd.Series, window: int = 7) -> Tuple[pd.Series, pd.Series]:
        """
        Calculates moving average baseline and rolling standard deviation.
        """
        baseline = series.rolling(window=window, min_periods=1).mean()
        std = series.rolling(window=window, min_periods=1).std().fillna(1.0)
        return baseline, std

    def calculate_zscore(self, actual: float, baseline: float, std: float) -> float:
        """
        Calculates statistical standard deviation (Z-score) deviation from expected baseline.
        """
        if std <= 0.001:
            return 0.0
        return float((actual - baseline) / std)

    def run_isolation_forest(self, features: np.ndarray) -> np.ndarray:
        """
        Unsupervised anomaly detection using Scikit-Learn Isolation Forest.
        Returns boolean mask where True indicates an isolated anomaly.
        """
        if len(features) < 10:
            # Fallback if sample size is too small for IsolationForest
            return np.zeros(len(features), dtype=bool)

        try:
            scaler = StandardScaler()
            scaled_features = scaler.fit_transform(features)
            iso = IsolationForest(contamination=self.contamination, random_state=42)
            preds = iso.fit_predict(scaled_features)
            # IsolationForest returns -1 for outliers, 1 for inliers
            return preds == -1
        except Exception:
            return np.zeros(len(features), dtype=bool)

    def calculate_risk_score(
        self,
        spike_magnitude_pct: float,
        duration_days: int,
        pharmacies_affected: int,
        total_zone_pharmacies: int,
        has_cross_category_correlation: bool
    ) -> Dict[str, float]:
        """
        Calculates Composite Public-Health Risk Score (0 - 100):
        Formula:
          Risk Score = 0.35 * Spike Magnitude
                     + 0.25 * Time Persistence
                     + 0.20 * Geographic Concentration
                     + 0.20 * Cross-category Correlation

        Component Normalizations:
          - Spike Magnitude: (spike_pct / 100.0) scaled up to 100 max
          - Time Persistence: (min(duration_days, 7) / 7.0) * 100
          - Geographic Concentration: (pharmacies_affected / max(total_zone_pharmacies, 1)) * 100
          - Cross-category Correlation: 100 if correlated patterns detected else 25
        """
        # 1. Spike magnitude normalized (cap at 100% scaled)
        # e.g., an 87% spike maps to 87
        spike_mag_score = min(max(spike_magnitude_pct, 0.0), 100.0)

        # 2. Time persistence (up to 7 days = 100)
        time_persistence_score = min((duration_days / 7.0) * 100.0, 100.0)

        # 3. Geographic concentration (ratio of affected pharmacies in zone)
        ratio = pharmacies_affected / max(total_zone_pharmacies, 1)
        geo_score = min(ratio * 100.0, 100.0)

        # 4. Cross-category correlation (co-occurring spikes in related therapeutics)
        cross_score = 100.0 if has_cross_category_correlation else 25.0

        raw_score = (
            0.35 * spike_mag_score +
            0.25 * time_persistence_score +
            0.20 * geo_score +
            0.20 * cross_score
        )

        final_score = round(min(max(raw_score, 0.0), 100.0), 1)

        return {
            "risk_score": final_score,
            "spike_magnitude": round(spike_mag_score * 0.35, 1),
            "time_persistence": round(time_persistence_score * 0.25, 1),
            "geographic_concentration": round(geo_score * 0.20, 1),
            "cross_category": round(cross_score * 0.20, 1),
            "raw_spike_mag": round(spike_mag_score, 1),
            "raw_time_persist": round(time_persistence_score, 1),
            "raw_geo": round(geo_score, 1),
            "raw_cross": round(cross_score, 1)
        }

    def classify_severity(self, risk_score: float) -> str:
        """
        Classification:
          0-30:   NORMAL
          31-60:  WATCH
          61-80:  ALERT
          81-100: HIGH_SIGNAL
        """
        if risk_score >= 81.0:
            return "HIGH_SIGNAL"
        elif risk_score >= 61.0:
            return "ALERT"
        elif risk_score >= 31.0:
            return "WATCH"
        else:
            return "NORMAL"

    def detect_geographic_clusters(self, df: pd.DataFrame, zone: str, category: str) -> Dict[str, Any]:
        """
        Evaluates geographic clustering and affected pharmacy counts within a given zone.
        """
        zone_df = df[(df["zone"] == zone) & (df["category_name"] == category)]
        if zone_df.empty:
            return {"pharmacies_affected": 0, "total_pharmacies": 0, "pct_affected": 0.0}

        total_pharmacies = zone_df["pharmacy_id"].nunique()
        # Pharmacies exhibiting recent anomaly or > 30% surge
        affected_pharmacies = zone_df[zone_df["is_anomaly"] == True]["pharmacy_id"].nunique()
        pct_affected = (affected_pharmacies / max(total_pharmacies, 1)) * 100.0

        return {
            "pharmacies_affected": affected_pharmacies,
            "total_pharmacies": total_pharmacies,
            "pct_affected": round(pct_affected, 1)
        }

    def evaluate_cross_category_correlation(self, df: pd.DataFrame, zone: str, primary_category: str) -> Tuple[bool, List[str]]:
        """
        Checks if related therapeutic categories are simultaneously experiencing demand elevation.
        """
        related_candidates = CORRELATED_CATEGORIES.get(primary_category, [])
        elevated_related = []

        zone_df = df[df["zone"] == zone]
        for rel_cat in related_candidates:
            cat_df = zone_df[zone_df["category_name"] == rel_cat]
            if not cat_df.empty and (cat_df["is_anomaly"].sum() > 0 or cat_df["quantity"].mean() > cat_df["expected_quantity"].mean() * 1.25):
                elevated_related.append(rel_cat)

        has_correlation = len(elevated_related) > 0
        return has_correlation, elevated_related

    def generate_signal(
        self,
        zone: str,
        category: str,
        demand_change_pct: float,
        baseline_demand: float,
        current_demand: float,
        duration_days: int,
        pharmacies_affected: int,
        total_zone_pharmacies: int,
        z_score: float,
        has_cross_correlation: bool,
        related_categories: List[str]
    ) -> Dict[str, Any]:
        """
        Generates structured early-warning intelligence signal.
        Enforces clear disclaimer that this is a decision-support prototype.
        """
        score_breakdown = self.calculate_risk_score(
            spike_magnitude_pct=demand_change_pct,
            duration_days=duration_days,
            pharmacies_affected=pharmacies_affected,
            total_zone_pharmacies=total_zone_pharmacies,
            has_cross_category_correlation=has_cross_correlation
        )

        risk_score = score_breakdown["risk_score"]
        severity = self.classify_severity(risk_score)

        title = f"{category} Medicine Demand Spike"
        explanation = (
            f"An unusual increase in {category.lower()}-category demand was detected across "
            f"{pharmacies_affected} pharmacies in {zone}. The pattern has persisted for {duration_days} "
            f"consecutive days and exceeds the historical baseline by {demand_change_pct:.1f}% ({z_score:.1f}σ). "
            f"This is a potential anomaly and should be verified with authorized public-health surveillance data."
        )

        recommendation = "Potential anomaly detected — verification recommended with public health authorities."

        return {
            "title": title,
            "zone": zone,
            "category": category,
            "risk_score": risk_score,
            "severity": severity,
            "demand_change": round(demand_change_pct, 1),
            "baseline_demand": round(baseline_demand, 1),
            "current_demand": round(current_demand, 1),
            "pharmacies_affected": pharmacies_affected,
            "total_zone_pharmacies": total_zone_pharmacies,
            "duration_days": duration_days,
            "z_score": round(z_score, 1),
            "score_breakdown": score_breakdown,
            "related_categories": ", ".join(related_categories) if related_categories else "None",
            "explanation": explanation,
            "recommendation": recommendation,
            "status": "High Signal" if severity == "HIGH_SIGNAL" else ("Alert" if severity == "ALERT" else "Watch"),
            "threshold_notice": "These thresholds are prototype parameters and require validation before real-world deployment."
        }

    def detect_anomalies(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[Dict[str, Any]]]:
        """
        Full pipeline:
        Raw Data -> Aggregation -> Moving Average & Z-score -> Isolation Forest -> Signal Generation
        """
        if df.empty:
            return df, []

        df = df.copy()
        if "date" in df.columns:
            df["date"] = pd.to_datetime(df["date"]).dt.date

        df["expected_quantity"] = 0.0
        df["anomaly_score"] = 0.0
        df["is_anomaly"] = False

        signals = []

        # Group by (zone, category_name) to calculate realistic baseline trends
        grouped = df.groupby(["zone", "category_name"])
        for (zone, cat_name), group_data in grouped:
            sorted_group = group_data.sort_values("date")
            quantities = sorted_group["quantity"].astype(float)

            # 1. Moving average baseline & std
            baseline, std = self.calculate_baseline(quantities, window=self.moving_avg_window)
            df.loc[sorted_group.index, "expected_quantity"] = baseline.round(1)

            # 2. Z-Scores
            z_scores = (quantities - baseline) / std
            z_scores = z_scores.replace([np.inf, -np.inf], 0.0).fillna(0.0)
            df.loc[sorted_group.index, "anomaly_score"] = z_scores.round(2)

            # 3. Isolation Forest features
            features = np.column_stack([
                quantities.values,
                z_scores.values,
                sorted_group["stock_level"].values if "stock_level" in sorted_group.columns else np.full(len(sorted_group), 100)
            ])
            iso_anomalies = self.run_isolation_forest(features)

            # Combined detection criteria (Z-score surge or isolation outlier)
            is_anom = (z_scores >= self.zscore_threshold) | (iso_anomalies & (z_scores > 1.5))
            df.loc[sorted_group.index, "is_anomaly"] = is_anom

            # Check if recent days show a persistent cluster/spike
            recent_window = sorted_group.tail(7)
            recent_anomalies = is_anom.loc[recent_window.index]

            if recent_anomalies.sum() >= 2:
                # Calculate aggregated stats for signal
                current_qty = recent_window["quantity"].mean()
                base_qty = max(recent_window["expected_quantity"].mean(), 1.0)
                demand_change_pct = ((current_qty - base_qty) / base_qty) * 100.0

                if demand_change_pct > 25.0:
                    duration_days = int(recent_anomalies.sum())
                    pharmacies_in_zone = sorted_group["pharmacy_id"].nunique()
                    affected_pharmacies = recent_window[recent_anomalies]["pharmacy_id"].nunique()
                    avg_z = float(z_scores.loc[recent_window.index].max())

                    has_cross, rel_cats = self.evaluate_cross_category_correlation(df, zone, cat_name)

                    signal = self.generate_signal(
                        zone=zone,
                        category=cat_name,
                        demand_change_pct=demand_change_pct,
                        baseline_demand=base_qty,
                        current_demand=current_qty,
                        duration_days=max(duration_days, 1),
                        pharmacies_affected=max(affected_pharmacies, 1),
                        total_zone_pharmacies=max(pharmacies_in_zone, 1),
                        z_score=avg_z,
                        has_cross_correlation=has_cross,
                        related_categories=rel_cats
                    )
                    signals.append(signal)

        # Sort signals by highest risk score first
        signals.sort(key=lambda s: s["risk_score"], reverse=True)
        return df, signals

# Singleton instance
anomaly_engine = AnomalyDetector()
