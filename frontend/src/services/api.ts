import {
  User,
  DashboardData,
  SignalItem,
  SignalDetail,
  MapZoneSignal,
  PharmacySalesRecord,
  InventoryCategory,
  NotificationItem,
  ReportItem,
  AiAnalyticsData,
  TrendPoint
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('pharmapulse_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const err = await res.json();
      errorMsg = err.detail || err.message || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string, role?: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await handleResponse<any>(res);
    localStorage.setItem('pharmapulse_token', data.access_token);
    return {
      access_token: data.access_token,
      user: {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        is_active: true,
      },
    };
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<User>(res);
  },

  logout(): void {
    localStorage.removeItem('pharmapulse_token');
  },

  // Dashboard
  async getDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  // Signals
  async getSignals(params?: { severity?: string; status?: string; zone?: string; category?: string }): Promise<SignalItem[]> {
    const query = new URLSearchParams();
    if (params?.severity) query.append('severity', params.severity);
    if (params?.status) query.append('status', params.status);
    if (params?.zone) query.append('zone', params.zone);
    if (params?.category) query.append('category', params.category);

    const res = await fetch(`${API_BASE}/signals?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<SignalItem[]>(res);
  },

  async getSignalDetail(id: number): Promise<SignalDetail> {
    const res = await fetch(`${API_BASE}/signals/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<SignalDetail>(res);
  },

  async reviewSignal(id: number, reviewStatus: string, notes: string, assignedTo?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/signals/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        review_status: reviewStatus,
        notes,
        assigned_to_officer: assignedTo || '',
      }),
    });
    return handleResponse<any>(res);
  },

  async assignSignal(id: number, officerName: string, notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/signals/${id}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        assigned_to_officer: officerName,
        notes: notes || '',
      }),
    });
    return handleResponse<any>(res);
  },

  // Pharmacy Data
  async getSalesData(params?: {
    page?: number;
    limit?: number;
    zone?: string;
    category?: string;
    search?: string;
    sort_by?: string;
    order?: string;
  }): Promise<{ records: PharmacySalesRecord[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.zone) query.append('zone', params.zone);
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.order) query.append('order', params.order);

    const res = await fetch(`${API_BASE}/pharmacies/data?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  async uploadCsv(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('pharmapulse_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/pharmacies/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<any>(res);
  },

  getSampleCsvUrl(): string {
    return `${API_BASE}/pharmacies/sample-csv`;
  },

  // Analytics Engine
  async getAnalyticsOverview(): Promise<AiAnalyticsData> {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: getAuthHeader(),
    });
    return handleResponse<AiAnalyticsData>(res);
  },

  async getTrends(timeframe = '30 Days', category?: string): Promise<TrendPoint[]> {
    const query = new URLSearchParams({ timeframe });
    if (category) query.append('category', category);

    const res = await fetch(`${API_BASE}/analytics/trends?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<TrendPoint[]>(res);
  },

  // Map
  async getMapSignals(category?: string): Promise<MapZoneSignal[]> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);

    const res = await fetch(`${API_BASE}/analytics/map/signals?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<MapZoneSignal[]>(res);
  },

  // Inventory
  async getInventory(): Promise<{ categories: InventoryCategory[]; chart_data: any[]; disclaimer: string }> {
    const res = await fetch(`${API_BASE}/inventory`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  // Reports
  async getReports(): Promise<ReportItem[]> {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ReportItem[]>(res);
  },

  async generateReport(payload: { zone: string; category: string; date_range: string }): Promise<ReportItem> {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return handleResponse<ReportItem>(res);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeader(),
    });
    return handleResponse<NotificationItem[]>(res);
  },

  async markNotificationRead(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  async markAllNotificationsRead(): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  // ML Demo Scenario
  async triggerDemoScenario(): Promise<any> {
    const res = await fetch(`${API_BASE}/ml/demo-scenario`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },
};
