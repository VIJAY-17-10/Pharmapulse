import React from 'react';
import { AlertCircle, Clock, MapPin, Store, ArrowUpRight, CheckCircle2, Search, Info } from 'lucide-react';
import { SignalItem } from '../types';
import { RiskBadge } from './RiskBadge';

interface SignalCardProps {
  signal: SignalItem;
  onViewDetails: (signal: SignalItem) => void;
  onInvestigate?: (signal: SignalItem) => void;
  onMarkReviewed?: (signal: SignalItem) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onViewDetails,
  onInvestigate,
  onMarkReviewed,
}) => {
  const isHigh = signal.severity === 'HIGH_SIGNAL' || signal.risk_score >= 80;

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between ${
        isHigh ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200/80'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                {signal.category}
              </span>
              <RiskBadge severity={signal.severity} />
              {signal.status !== 'UNREVIEWED' && <RiskBadge status={signal.status} size="sm" />}
            </div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
              {signal.title}
            </h4>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-extrabold text-slate-900">{signal.risk_score}</span>
            <span className="text-[11px] text-slate-400 font-medium block">/ 100</span>
          </div>
        </div>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">Area: <strong className="text-slate-900">{signal.area}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span>Demand: <strong className="text-rose-600">+{signal.demand_change_pct}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">Duration: <strong className="text-slate-900">{signal.duration_days} days</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Pharmacies: <strong className="text-slate-900">{signal.pharmacies_affected}</strong></span>
          </div>
        </div>

        {/* Short early warning explanation */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {signal.explanation}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(signal)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 rounded-lg transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          View Details
        </button>

        <div className="flex items-center gap-1.5">
          {onInvestigate && signal.status !== 'INVESTIGATING' && (
            <button
              onClick={() => onInvestigate(signal)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Search className="w-3 h-3" />
              Investigate
            </button>
          )}

          {onMarkReviewed && signal.status === 'UNREVIEWED' && (
            <button
              onClick={() => onMarkReviewed(signal)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              Mark Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
