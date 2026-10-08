import React from 'react';
import { X, Sparkles, Brain, ArrowUpRight, Activity, MapPin, Layers, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SignalItem } from '../types';
import { RiskScoreBar } from './RiskScoreBar';
import { RiskBadge } from './RiskBadge';

interface AIExplanationModalProps {
  signal: SignalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkReviewed?: (signal: SignalItem) => void;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  signal,
  isOpen,
  onClose,
  onMarkReviewed,
}) => {
  if (!isOpen || !signal) return null;

  const breakdown = {
    spikeMagnitude: signal.spike_magnitude_score || 30.3,
    timePersistence: signal.time_persistence_score || 14.3,
    geographicConcentration: signal.geographic_concentration_score || 18.7,
    crossCategory: signal.cross_category_score || 18.7,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-teal-400">Explainable AI (XAI)</span>
                <span className="text-xs text-slate-400">ID #{signal.id}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{signal.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Signal context pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                Zone: {signal.area}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
                Category: {signal.category}
              </span>
              <RiskBadge severity={signal.severity} />
            </div>
            <span className="text-xs text-slate-400">Detected: {new Date(signal.created_at).toLocaleDateString()}</span>
          </div>

          {/* Section: WHY WAS THIS SIGNAL GENERATED? */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Why Was This Signal Generated?
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                  <span>Demand Spike</span>
                </div>
                <div className="text-xl font-extrabold text-rose-600">+{signal.demand_change_pct}%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">vs rolling baseline</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span>Historical Deviation</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">{signal.z_score || 3.2}σ</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Statistical Z-Score</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Duration</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">{signal.duration_days} days</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Consecutive surge</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pharmacies Affected</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">{signal.pharmacies_affected}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Reporting counters</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Layers className="w-3.5 h-3.5 text-purple-500" />
                  <span>Related Categories</span>
                </div>
                <div className="text-base font-extrabold text-slate-900 truncate">
                  {signal.related_categories || 'Cough/Cold, Fever'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Co-occurring demand</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Geographic Pattern</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">High</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Clustered in {signal.area}</div>
              </div>
            </div>
          </div>

          {/* Section: Risk Score Visualization */}
          <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
            <RiskScoreBar score={signal.risk_score} breakdown={breakdown} showBreakdown={true} />
          </div>

          {/* Section: AI Narrative Explanation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Surveillance Intelligence Explanation
            </h4>
            <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl text-xs text-slate-700 leading-relaxed">
              {signal.explanation}
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="font-semibold block text-amber-950 mb-0.5">Recommended Protocol:</strong>
              {signal.recommendation}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 italic">
            Decision-support prototype. Never claim an outbreak is confirmed.
          </p>
          <div className="flex items-center gap-2">
            {onMarkReviewed && signal.status === 'UNREVIEWED' && (
              <button
                onClick={() => {
                  onMarkReviewed(signal);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Verified & Reviewed
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
