export type UserRole = 'Admin' | 'Health Officer' | 'Pharmacy' | 'Analyst';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface KpiCardData {
  title: string;
  value: string | number;
  trend_pct: number;
  trend_label: string;
  description: string;
  subtext?: string;
}

export interface DashboardData {
  kpis: {
    active_signals?: KpiCardData;
    critical_signals?: KpiCardData;
    pharmacies_monitored?: KpiCardData;
    areas_monitored?: KpiCardData;
    detection_accuracy?: KpiCardData;
    average_detection_time?: KpiCardData;
    [key: string]: any;
  };
  recent_signals: SignalItem[];
  trends: TrendPoint[];
  unread_notifications: number;
  disclaimer: string;
}

export interface TrendPoint {
  date: string;
  category: string;
  actual_demand: number;
  expected_demand: number;
  deviation_pct: number;
  is_anomaly: boolean;
}

export type SignalSeverity = 'NORMAL' | 'WATCH' | 'ALERT' | 'HIGH_SIGNAL';
export type SignalStatus = 'UNREVIEWED' | 'REVIEWED' | 'INVESTIGATING' | 'DISMISSED';

export interface SignalItem {
  id: number;
  title: string;
  area: string;
  category: string;
  demand_change_pct: number;
  baseline_demand: number;
  current_demand: number;
  duration_days: number;
  pharmacies_affected: number;
  risk_score: number;
  severity: SignalSeverity;
  status: SignalStatus;
  z_score: number;
  spike_magnitude_score: number;
  time_persistence_score: number;
  geographic_concentration_score: number;
  cross_category_score: number;
  related_categories: string;
  explanation: string;
  recommendation: string;
  created_at: string;
  updated_at?: string;
}

export interface SignalDetail extends SignalItem {
  metrics: {
    demand_spike_pct: number;
    historical_deviation_z: string;
    duration: string;
    pharmacies_affected: number;
    related_categories: string;
    geographic_concentration: string;
  };
  score_breakdown: {
    spike_magnitude: { weight_pct: number; score_contribution: number; label: string };
    time_persistence: { weight_pct: number; score_contribution: number; label: string };
    geographic_concentration: { weight_pct: number; score_contribution: number; label: string };
    cross_category_correlation: { weight_pct: number; score_contribution: number; label: string };
  };
  formula: string;
  narrative: string;
  disclaimer: string;
  reviews?: Array<{
    id: number;
    review_status: string;
    notes: string;
    assigned_to_officer?: string;
    reviewed_at: string;
  }>;
}

export interface MapZoneSignal {
  zone: string;
  area_name: string;
  latitude: number;
  longitude: number;
  pharmacies_count: number;
  active_signals_count: number;
  status: string;
  risk_score: number;
  top_affected_category: string;
  demand_change_pct: number;
  latest_signal_id?: number | null;
  signal_title?: string;
}

export interface PharmacySalesRecord {
  id: number;
  pharmacy_code: string;
  pharmacy_name: string;
  zone: string;
  date: string;
  category: string;
  quantity: number;
  expected_quantity: number;
  stock_level: string;
  raw_stock_level: number;
  status: 'Normal' | 'Watch' | 'Alert' | 'High Signal';
  is_anomaly: boolean;
  anomaly_score: number;
}

export interface InventoryCategory {
  category_name: string;
  total_stock: number;
  average_stock_level_pct: number;
  demand_change_pct: number;
  stock_change_pct: number;
  supply_risk: 'LOW' | 'MEDIUM' | 'HIGH';
  potential_supply_pressure: boolean;
  affected_zones: string[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  zone: string;
  is_read: boolean;
  created_at: string;
}

export interface ReportItem {
  id: number;
  title: string;
  zone: string;
  category: string;
  date_range: string;
  executive_summary: string;
  risk_score: number;
  report_data: any;
  created_at: string;
}

export interface AiAnalyticsData {
  model_name: string;
  description: string;
  methods: Array<{ name: string; role: string; weight: string }>;
  metrics: {
    anomalies_detected: number;
    false_positive_rate: string;
    precision: string;
    recall: string;
    f1_score: string;
  };
  evaluation_note: string;
  detection_pipeline: Array<{ step: number; name: string; desc: string }>;
  formula: {
    equation: string;
    weights: Record<string, number>;
    classification: Record<string, string>;
    disclaimer: string;
  };
  model_comparison: Array<{
    method: string;
    precision: number;
    recall: number;
    f1: number;
    fpr: number;
  }>;
}
