import React, { useState } from 'react';
import { Activity, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (email: string, password: string, role?: string) => Promise<void>;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBackToLanding }) => {
  const [email, setEmail] = useState('officer@pharmapulse.demo');
  const [password, setPassword] = useState('Officer@123');
  const [role, setRole] = useState<UserRole>('Health Officer');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Health Officer' as UserRole,
      email: 'officer@pharmapulse.demo',
      password: 'Officer@123',
      name: 'Priya Sundaram',
      desc: 'Municipal Epidemiologist & Triage',
    },
    {
      role: 'Admin' as UserRole,
      email: 'admin@pharmapulse.demo',
      password: 'Admin@123',
      name: 'Dr. Rajesh Varma',
      desc: 'System & Registry Configuration',
    },
    {
      role: 'Analyst' as UserRole,
      email: 'analyst@pharmapulse.demo',
      password: 'Analyst@123',
      name: 'Arun Kumar',
      desc: 'Time-series & ML Model Evaluation',
    },
    {
      role: 'Pharmacy' as UserRole,
      email: 'pharmacy@pharmapulse.demo',
      password: 'Pharmacy@123',
      name: 'Apollo Retail PH-004',
      desc: 'Inventory Point Data Ingestion',
    },
  ];

  const fillAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setRole(account.role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password, role);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Branding & Intelligence Description */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-navy-800 to-navy-900 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            <button
              onClick={onBackToLanding}
              className="text-xs text-slate-400 hover:text-white mb-8 flex items-center gap-1 transition-colors"
            >
              ← Back to public portal
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  Pharma<span className="text-teal-400">Pulse</span>
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Smart India Hackathon 2026
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
              Public Health Early-Warning Intelligence
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              AI-powered early warning intelligence for pharmacy demand patterns. Decision support for municipal health officers and disease surveillance units.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Aggregated daily point-of-sale telemetry (Zero PII collected).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Hybrid unsupervised Isolation Forest & statistical Z-scores.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Automated syndromic cross-category correlation detection.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>Prototype Notice:</strong> Decision support system. Never confirms disease or outbreak.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Access Surveillance Portal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select a role and sign in with authorized credentials
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Surveillance Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Health Officer">Health Officer (IDSP & Surveillance)</option>
                <option value="Admin">Administrator (System & Config)</option>
                <option value="Analyst">Analyst (Data & ML Models)</option>
                <option value="Pharmacy">Pharmacy (Data Ingestion Point)</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pharmapulse.demo"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-slate-400 text-[11px]">Protected Session</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-teal-600" />
                Quick 1-Click Demo Accounts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillAccount(acc)}
                  className={`p-2 rounded-xl border text-left transition-all text-xs ${
                    email === acc.email
                      ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="font-bold text-slate-800 block truncate">{acc.role}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
