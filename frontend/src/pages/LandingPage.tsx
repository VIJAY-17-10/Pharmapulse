import React from 'react';
import {
  Activity,
  Shield,
  Brain,
  ArrowRight,
  Lock,
  Database,
  BarChart3,
  Network,
  Users,
  Eye,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onGoToLogin,
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                Pharma<span className="text-teal-600">Pulse</span>
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.2 rounded">
                SIH Prototype
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoToLogin}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-6 animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart India Hackathon (SIH) — Public Health Track</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Detect the Signal <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Before It Becomes a Crisis.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PharmaPulse transforms aggregated pharmacy-demand patterns into explainable early-warning signals for public-health investigation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>View How It Works</span>
            </a>
          </div>

          {/* Decision Support Disclaimer Badge */}
          <div className="mt-8 max-w-xl mx-auto bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900">
            <strong>Decision-Support Notice:</strong> PharmaPulse provides statistical anomaly alerts. It never confirms outbreaks or medical diagnoses. Verification is always recommended.
          </div>
        </div>
      </section>

      {/* Visual Process Flow: Pharmacy Data -> AI Analysis -> Anomaly Detection -> Risk Signal -> Health Authority */}
      <section id="how-it-works" className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-wider text-teal-600 mb-2">Surveillance Pipeline</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              From Counter Sales to Public-Health Action
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              How non-PII point-of-sale signals are processed through automated AI intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Pharmacy Data',
                desc: 'Daily aggregated retail transactions (No PII).',
                icon: Database,
              },
              {
                step: '02',
                title: 'AI Analysis',
                desc: 'Rolling 7-day adaptive baselines & moving averages.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Anomaly Detection',
                desc: 'Z-score surge thresholds & Isolation Forest.',
                icon: BarChart3,
              },
              {
                step: '04',
                title: 'Risk Signal',
                desc: 'Composite risk scoring & XAI explanation.',
                icon: Network,
              },
              {
                step: '05',
                title: 'Health Authority',
                desc: 'District officer verification & field triage.',
                icon: Users,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50 p-5 rounded-xl border border-slate-200/70 relative group hover:border-teal-300 hover:shadow-card transition-all"
                >
                  <span className="text-[11px] font-black text-teal-600 tracking-wider block mb-2">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 mb-3 shadow-xs">
                    <Icon className="w-5 h-5 text-teal-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">The Problem</span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Traditional Epidemiological Surveillance Has a 7–14 Day Latency
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Patients visit neighborhood community pharmacies days before seeking tertiary hospital admission or having clinical diagnostic swabs confirmed. Hospital reporting networks frequently miss early community surges during infectious incubation phases.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Hospital OPD records capture lagging acute stages.</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span>Manual paper logging creates reporting delays of 1 to 2 weeks.</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">The Solution</span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Syndromic Point-of-Sale Early Warning Intelligence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By passively aggregating non-identifiable retail demand for over-the-counter and prescription therapeutics (antipyretics, bronchodilators, oral rehydration salts), municipal health officers receive anomaly alerts in as fast as 4.2 hours.
              </p>
              <div className="space-y-2 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Early-warning lead time of 3 to 5 days ahead of hospital admission waves.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Explainable AI models justify why a signal was triggered.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy by Design Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-wider text-teal-600 mb-2">Ethics & Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Privacy by Design
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              PharmaPulse protects individual patient privacy while delivering population-level intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'No Patient Names',
                desc: 'Zero patient names, phone numbers, or residential addresses are ever collected or stored.',
                icon: Eye,
              },
              {
                title: 'No Personal Medical Records',
                desc: 'Individual medical history, doctor names, and lab diagnoses remain untouched.',
                icon: FileCheck,
              },
              {
                title: 'Aggregated Quantities Only',
                desc: 'Data is aggregated strictly as daily units sold and remaining inventory percentage.',
                icon: Database,
              },
              {
                title: 'Anonymized Pharmacy Codes',
                desc: 'Retailers are protected via pseudonymous identifier tokens (e.g. PH-001).',
                icon: Lock,
              },
              {
                title: 'Role-Based Access Control',
                desc: 'Strict JWT role separation: Admin, Health Officer, Pharmacy, and Epidemiologist Analyst.',
                icon: Shield,
              },
              {
                title: 'Secure API Architecture',
                desc: 'HTTPS encrypted REST APIs with input schema validation and rate limiting.',
                icon: Network,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-card transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{card.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <strong className="text-white block font-bold">meddoc — PharmaPulse Early Warning System</strong>
            <span>Smart India Hackathon (SIH) Prototype • Synthetic Demo Telemetry</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Decision-Support Prototype • Never confirms medical diagnosis</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
