import React, { useState } from 'react';
import {
  User, Bell, Shield, Database, Palette, Globe,
  CheckCircle, Save, RefreshCw, AlertTriangle, Eye, EyeOff, Info
} from 'lucide-react';

type Section = 'profile' | 'notifications' | 'security' | 'data' | 'appearance' | 'system';

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'system', label: 'System Info', icon: Globe },
];

const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-white/20'}`}
  >
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const SettingsSection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-white font-bold text-base">{title}</h2>
      {description && <p className="text-gray-400 text-sm mt-0.5">{description}</p>}
    </div>
    <div className="bg-gray-900/80 border border-white/10 rounded-xl divide-y divide-white/5">
      {children}
    </div>
  </div>
);

const SettingRow: React.FC<{ label: string; description?: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex items-center justify-between p-4 gap-4">
    <div className="flex-1 min-w-0">
      <div className="text-white text-sm font-medium">{label}</div>
      {description && <div className="text-gray-500 text-xs mt-0.5">{description}</div>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile state
  const [name, setName] = useState('Dr. Priya Sharma');
  const [email, setEmail] = useState('priya.sharma@delhihealth.gov.in');
  const [role, setRole] = useState('Public Health Analyst');
  const [zone, setZone] = useState('Zone A – North Delhi');

  // Notification toggles
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    criticalOnly: false,
    weeklyDigest: true,
    smsAlerts: false,
    browserPush: true,
    systemUpdates: true,
  });

  // Appearance
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('blue');

  // Data
  const [dataRetention, setDataRetention] = useState('90');
  const [exportFormat, setExportFormat] = useState('csv');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <SettingsSection title="Profile Information" description="Manage your public health authority account details">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                  PS
                </div>
                <div>
                  <div className="text-white font-semibold">{name}</div>
                  <div className="text-gray-400 text-sm">{role}</div>
                  <button className="text-blue-400 text-xs mt-1 hover:underline">Change Avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: name, setter: setName, type: 'text' },
                  { label: 'Email Address', value: email, setter: setEmail, type: 'email' },
                  { label: 'Role / Designation', value: role, setter: setRole, type: 'text' },
                  { label: 'Primary Zone', value: zone, setter: setZone, type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-gray-400 text-xs mb-1.5 font-medium">{field.label}</label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-300 text-xs flex gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Account changes are logged for compliance. Profile data is used for audit trail purposes only.
              </div>
            </div>
          </SettingsSection>
        );

      case 'notifications':
        return (
          <SettingsSection title="Notification Preferences" description="Control how and when you receive alerts about anomaly signals">
            <SettingRow label="Email Alerts" description="Receive signal alerts via institutional email">
              <Toggle value={notifs.emailAlerts} onChange={v => setNotifs(p => ({ ...p, emailAlerts: v }))} />
            </SettingRow>
            <SettingRow label="Critical Signals Only" description="Only notify for Critical risk-level signals">
              <Toggle value={notifs.criticalOnly} onChange={v => setNotifs(p => ({ ...p, criticalOnly: v }))} />
            </SettingRow>
            <SettingRow label="Weekly Digest" description="Summarized weekly anomaly report every Monday">
              <Toggle value={notifs.weeklyDigest} onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
            </SettingRow>
            <SettingRow label="SMS Alerts" description="High-urgency text messages for critical alerts">
              <Toggle value={notifs.smsAlerts} onChange={v => setNotifs(p => ({ ...p, smsAlerts: v }))} />
            </SettingRow>
            <SettingRow label="Browser Push Notifications" description="Desktop notifications while using the dashboard">
              <Toggle value={notifs.browserPush} onChange={v => setNotifs(p => ({ ...p, browserPush: v }))} />
            </SettingRow>
            <SettingRow label="System Update Notifications" description="Notify about ML model updates and data refreshes">
              <Toggle value={notifs.systemUpdates} onChange={v => setNotifs(p => ({ ...p, systemUpdates: v }))} />
            </SettingRow>
          </SettingsSection>
        );

      case 'security':
        return (
          <SettingsSection title="Security Settings" description="Protect your account and configure authentication">
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="●●●●●●●●"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 pr-10"
                  />
                  <button className="absolute right-3 top-2.5 text-gray-400 hover:text-white" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">New Password</label>
                <input type="password" placeholder="Enter new password..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-1.5 font-medium">Confirm New Password</label>
                <input type="password" placeholder="Confirm new password..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
              </div>
              <button className="w-full py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-semibold">
                Update Password
              </button>
            </div>
            <SettingRow label="Two-Factor Authentication" description="Recommended for health authority accounts">
              <button className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors">
                Enabled ✓
              </button>
            </SettingRow>
            <SettingRow label="Session Timeout" description="Automatically log out after inactivity">
              <select className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                <option value="30">30 minutes</option>
                <option value="60" selected>60 minutes</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
              </select>
            </SettingRow>
          </SettingsSection>
        );

      case 'data':
        return (
          <SettingsSection title="Data & Privacy Settings" description="Control data retention and privacy compliance">
            <SettingRow label="Data Retention Period" description="How long aggregated pharmacy data is stored">
              <select value={dataRetention} onChange={e => setDataRetention(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">6 months</option>
                <option value="365">1 year</option>
              </select>
            </SettingRow>
            <SettingRow label="Default Export Format" description="Format used when exporting reports and data">
              <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}
                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none cursor-pointer">
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="pdf">PDF</option>
              </select>
            </SettingRow>
            <div className="p-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-semibold">
                  <Info className="w-4 h-4" />
                  Privacy Compliance Statement
                </div>
                <p className="text-blue-200/80 text-xs leading-relaxed">
                  PharmaPulse processes only <strong>aggregated, de-identified</strong> pharmacy demand data.
                  No personally identifiable information (PII) is collected or stored. No patient names,
                  contact details, or medical histories are processed. All data handling complies with
                  India's Personal Data Protection Bill guidelines.
                </p>
              </div>
            </div>
          </SettingsSection>
        );

      case 'appearance':
        return (
          <SettingsSection title="Appearance Settings" description="Customize the dashboard look and feel">
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-3 font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['dark', 'light', 'system'].map(t => (
                    <button key={t}
                      onClick={() => setTheme(t)}
                      className={`py-3 rounded-lg border text-sm font-semibold capitalize transition-all ${theme === t ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-3 font-medium">Accent Color</label>
                <div className="flex gap-3">
                  {[
                    { name: 'blue', class: 'bg-blue-500' },
                    { name: 'indigo', class: 'bg-indigo-500' },
                    { name: 'purple', class: 'bg-purple-500' },
                    { name: 'cyan', class: 'bg-cyan-500' },
                    { name: 'teal', class: 'bg-teal-500' },
                    { name: 'green', class: 'bg-green-500' },
                  ].map(c => (
                    <button key={c.name} onClick={() => setAccentColor(c.name)}
                      className={`w-8 h-8 rounded-full ${c.class} transition-transform hover:scale-110 ${accentColor === c.name ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}`} />
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center text-gray-400 text-sm">
                <Palette className="w-6 h-6 mx-auto mb-2 opacity-50" />
                Theme preview will apply on next refresh (demo)
              </div>
            </div>
          </SettingsSection>
        );

      case 'system':
        return (
          <SettingsSection title="System Information" description="PharmaPulse application and AI model details">
            {[
              { label: 'Application Version', value: 'v1.0.0-SIH2024' },
              { label: 'AI/ML Engine', value: 'Isolation Forest + Z-Score Ensemble' },
              { label: 'Data Sources', value: '247 Partner Pharmacies (Demo)' },
              { label: 'Last Model Training', value: 'Jan 16, 2024 — 02:00 AM IST' },
              { label: 'Backend Framework', value: 'FastAPI (Python 3.11)' },
              { label: 'Database', value: 'SQLite (Local Demo) / PostgreSQL (Production)' },
              { label: 'Zones Monitored', value: '6 Administrative Zones, Delhi NCR' },
              { label: 'API Status', value: '✅ Operational' },
            ].map(item => (
              <SettingRow key={item.label} label={item.label}>
                <span className="text-gray-400 text-sm text-right max-w-xs">{item.value}</span>
              </SettingRow>
            ))}
            <div className="p-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-300 text-xs">
                ⚠️ <strong>SIH Prototype Disclaimer:</strong> This is a demonstration build using synthetic data.
                ML model outputs are indicative only. Not for clinical or public health decision-making without expert verification.
              </div>
            </div>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your PharmaPulse dashboard preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === item.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {renderContent()}

          {/* Save Button */}
          {activeSection !== 'system' && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg text-sm"
              >
                {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <RefreshCw className="w-4 h-4" />
                Reset to Defaults
              </button>
              {saved && (
                <span className="flex items-center gap-1 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Changes saved successfully
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
