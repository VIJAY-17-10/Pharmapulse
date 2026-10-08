import React, { useState, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import SignalsPage from './pages/SignalsPage';
import { PharmacyDataPage } from './pages/PharmacyDataPage';
import InventoryPage from './pages/InventoryPage';
import { AiAnalyticsPage } from './pages/AiAnalyticsPage';
import { ExplainableAiPage } from './pages/ExplainableAiPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { AIExplanationModal } from './components/AIExplanationModal';
import { User, NotificationItem, SignalItem } from './types';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'signals'
  | 'explainable-ai'
  | 'pharmacy-data'
  | 'analytics'
  | 'map'
  | 'inventory'
  | 'reports'
  | 'settings';

// ─── Toast ─────────────────────────────────────────────────────────────────────
interface ToastMsg {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
}

const ToastLayer: React.FC<{ toasts: ToastMsg[]; onRemove: (id: number) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
    {toasts.map(t => {
      const colors: Record<string, string> = {
        success: 'bg-green-500/90 border-green-400',
        error: 'bg-red-500/90 border-red-400',
        warning: 'bg-amber-500/90 border-amber-400',
        info: 'bg-blue-500/90 border-blue-400',
      };
      return (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur text-white text-sm font-semibold shadow-xl max-w-sm animate-in slide-in-from-right duration-300 ${colors[t.type]}`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-white/70 hover:text-white text-lg leading-none">×</button>
        </div>
      );
    })}
  </div>
);

// ─── Demo Notifications ───────────────────────────────────────────────────────
const demoNotifications: NotificationItem[] = [
  { id: 1, title: 'Critical Signal — Zone A', message: 'Oseltamivir demand up 340% over baseline.', type: 'alert', zone: 'Zone A', is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: 'High Signal — Zone C', message: 'ORS demand spike detected across 8 pharmacies.', type: 'warning', zone: 'Zone C', is_read: false, created_at: new Date().toISOString() },
  { id: 3, title: 'Model Retrained', message: 'Anomaly detection model updated with latest data.', type: 'info', zone: 'System', is_read: true, created_at: new Date().toISOString() },
];

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(demoNotifications);
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null);
  const [selectedModalSignal, setSelectedModalSignal] = useState<SignalItem | null>(null);

  // ── Toast helpers ────────────────────────────────────────────────────────
  const showToast = useCallback((type: ToastMsg['type'], message: string, _title?: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (email: string, _password: string, role?: string) => {
    const demoUser: User = {
      id: 1,
      email,
      full_name: email.startsWith('admin') ? 'Dr. Rajesh Varma' : 'Priya Sundaram',
      role: (role as User['role']) || 'Health Officer',
      is_active: true,
    };
    setUser(demoUser);
    setActiveTab('dashboard');
    showToast('success', `Welcome back, ${demoUser.full_name}!`);
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setActiveTab('landing');
    showToast('info', 'You have been logged out.');
  }, [showToast]);

  // ── Notification helpers ──────────────────────────────────────────────────
  const handleMarkNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }, []);

  const handleMarkAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }, []);

  const handleTriggerDemo = useCallback(() => {
    const id = Date.now();
    const newNotif: NotificationItem = {
      id,
      title: 'New Anomaly Signal Detected',
      message: 'Azithromycin spike in Zone F exceeds 3σ threshold.',
      type: 'alert',
      zone: 'Zone F',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast('warning', '🚨 New anomaly signal injected into Zone F!');
  }, [showToast]);

  const unreviewedCount = notifications.filter(n => !n.is_read).length;

  // ── Pre-auth pages ────────────────────────────────────────────────────────
  if (activeTab === 'landing' || activeTab === 'login') {
    return (
      <>
        {activeTab === 'landing' && (
          <LandingPage
            onEnterDashboard={() => setActiveTab('dashboard')}
            onGoToLogin={() => setActiveTab('login')}
          />
        )}
        {activeTab === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onBackToLanding={() => setActiveTab('landing')}
          />
        )}
        <ToastLayer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // ── Authenticated shell ───────────────────────────────────────────────────
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onViewSignalDetails={(s: SignalItem) => {
              setSelectedModalSignal(s);
              setSelectedSignalId(s.id);
            }}
            onNavigateTab={(tab: string) => setActiveTab(tab as Tab)}
            onTriggerDemo={handleTriggerDemo}
            showToast={showToast}
          />
        );
      case 'map':
        return (
          <MapPage
            onSelectZoneSignal={() => setActiveTab('signals')}
            showToast={showToast}
          />
        );
      case 'signals':
        return <SignalsPage />;
      case 'pharmacy-data':
        return <PharmacyDataPage showToast={showToast} />;
      case 'inventory':
        return <InventoryPage />;
      case 'analytics':
        return <AiAnalyticsPage />;
      case 'explainable-ai':
        return (
          <ExplainableAiPage
            selectedSignalId={selectedSignalId}
            showToast={showToast}
          />
        );
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onViewSignalDetails={(s: SignalItem) => {
              setSelectedModalSignal(s);
              setSelectedSignalId(s.id);
            }}
            onNavigateTab={(tab: string) => setActiveTab(tab as Tab)}
            onTriggerDemo={handleTriggerDemo}
            showToast={showToast}
          />
        );
    }
  };

  return (
    <>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab: string) => setActiveTab(tab as Tab)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          unreviewedSignalsCount={unreviewedCount}
        />

        {/* Right side */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNavbar
            user={user}
            notifications={notifications}
            activeTab={activeTab}
            onSelectTab={(tab: string) => setActiveTab(tab as Tab)}
            onLogout={handleLogout}
            onTriggerDemo={handleTriggerDemo}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onToggleSidebar={() => setSidebarOpen(p => !p)}
          />

          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>

      <AIExplanationModal
        signal={selectedModalSignal}
        isOpen={!!selectedModalSignal}
        onClose={() => setSelectedModalSignal(null)}
        onMarkReviewed={(sig) => {
          showToast('success', `Signal #${sig.id} marked as reviewed.`, 'Triage Updated');
          setSelectedModalSignal(null);
        }}
      />

      <ToastLayer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default App;
