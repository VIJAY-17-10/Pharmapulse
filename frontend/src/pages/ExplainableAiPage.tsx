import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  ArrowUpRight,
  Activity,
  Clock,
  MapPin,
  Layers,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { RiskScoreBar } from '../components/RiskScoreBar';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SignalItem } from '../types';
import { api } from '../services/api';

interface ExplainableAiPageProps {
  selectedSignalId?: number | null;
  onViewSignalDetails?: (sig: SignalItem) => void;
  showToast: (type: 'success' | 'warning' | 'info' | 'error', message: string, title?: string) => void;
}

export const ExplainableAiPage: React.FC<ExplainableAiPageProps> = ({
  selectedSignalId,
  showToast,
}) => {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [currentSignal, setCurrentSignal] = useState<SignalItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const list = await api.getSignals();
        setSignals(list);
        if (selectedSignalId) {
          const match = list.find((s) => s.id === selectedSignalId);
          setCurrentSignal(match || list[0]);
        } else if (list.length > 0) {
          setCurrentSignal(list[0]);
        }
      } catch (err) {
        console.error('Error fetching signals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, [selectedSignalId]);

  if (loading || !currentSignal) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading Explainable AI intelligence engine...
      </div>
    );
  }

  const breakdown = {
    spikeMagnitude: currentSignal.spike_magnitude_score || 30.3,
    timePersistence: currentSignal.time_persistence_score || 14.3,
    geographicConcentration: currentSignal.geographic_concentration_score || 18.7,
    crossCategory: currentSignal.cross_category_score || 18.7,
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-xl text-teal-600 border border-teal-200">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explainable AI (XAI)</h1>
              <p className="text-xs text-slate-500">
                Transparent multi-factor decomposition justifying early-warning signal generation.
              </p>
            </div>
          </div>
        </div>

        {/* Signal selector selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Signal:</span>
          <select
            value={currentSignal.id}
            onChange={(e) => {
              const selected = signals.find((s) => s.id === Number(e.target.value));
              if (selected) setCurrentSignal(selected);
            }}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {signals.map((s) => (
              <option key={s.id} value={s.id}>
                {s.area} — {s.title} (Risk: {s.risk_score})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main explanation card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {/* Banner with Title and Badges */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-navy-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Active Anomaly Flag
              </span>
              <RiskBadge severity={currentSignal.severity} />
              <RiskBadge status={currentSignal.status} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {currentSignal.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Location: <strong>{currentSignal.area}</strong> • Category: <strong>{currentSignal.category}</strong> • Detected: {new Date(currentSignal.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 text-right flex-shrink-0">
            <span className="text-xs text-teal-300 uppercase font-bold tracking-wider block">Composite Risk Score</span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">{currentSignal.risk_score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Section: WHY WAS THIS SIGNAL GENERATED? */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Why Was This Signal Generated?
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Demand Spike</span>
                </div>
                <div className="text-2xl font-black text-rose-600">+{currentSignal.demand_change_pct}%</div>
                <div className="text-[11px] text-slate-400 mt-1">vs 7-day baseline</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span>Historical Deviation</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{currentSignal.z_score || 3.2}σ</div>
                <div className="text-[11px] text-slate-400 mt-1">Z-Score Deviation</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Duration</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{currentSignal.duration_days} days</div>
                <div className="text-[11px] text-slate-400 mt-1">Consecutive trend</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pharmacies Affected</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{currentSignal.pharmacies_affected}</div>
                <div className="text-[11px] text-slate-400 mt-1">Out of zone total</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Related Categories</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 truncate">
                  {currentSignal.related_categories || 'Cough/Cold, Fever'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Syndromic co-surge</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Geographic Pattern</span>
                </div>
                <div className="text-2xl font-black text-slate-900">High</div>
                <div className="text-[11px] text-slate-400 mt-1">Spatial clustering</div>
              </div>
            </div>
          </div>

          {/* Section: Horizontal Risk Score Visualization */}
          <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Mathematical Score Breakdown (4 Weighted Pillars)
            </h4>
            <RiskScoreBar score={currentSignal.risk_score} breakdown={breakdown} showBreakdown={true} />
            <p className="text-[11px] text-slate-400 mt-3 italic">
              Risk Score = 0.35 × Spike Magnitude + 0.25 × Time Persistence + 0.20 × Geographic Pattern + 0.20 × Cross-category Link
            </p>
          </div>

          {/* Final Official Explanation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Synthesized Surveillance Narrative
            </h4>
            <div className="p-5 bg-blue-50/60 border border-blue-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
              {currentSignal.explanation}
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-xs text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 block text-sm mb-1">
                Field Action Protocol
              </strong>
              {currentSignal.recommendation}
            </div>
          </div>

          {/* Mandatory Public Health Disclaimer */}
          <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>CRITICAL PUBLIC HEALTH ETHICS DISCLAIMER:</strong> Never write or assume{' '}
            <em>“Outbreak confirmed.”</em> An unusual spike in pharmacy purchases can stem from supplier shortages, media reports, bulk clinic restocks, seasonal shifts, or local OTC purchasing behaviors. Verification using clinical lab tests and outpatient department records is mandatory.
          </div>
        </div>
      </div>
    </div>
  );
};
