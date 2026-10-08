import React from 'react';
import { SignalSeverity, SignalStatus } from '../types';

interface RiskBadgeProps {
  severity?: SignalSeverity | string;
  status?: SignalStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, status, size = 'md' }) => {
  const norm = (severity || status || 'NORMAL').toUpperCase().replace(' ', '_');

  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dot = 'bg-emerald-500';
  let label = 'Normal';

  if (norm === 'HIGH_SIGNAL' || norm === 'HIGH' || norm === 'CRITICAL') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200';
    dot = 'bg-rose-500';
    label = 'High Signal';
  } else if (norm === 'ALERT') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dot = 'bg-amber-500';
    label = 'Alert';
  } else if (norm === 'WATCH' || norm === 'MEDIUM') {
    bg = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    dot = 'bg-yellow-500';
    label = 'Watch';
  } else if (norm === 'REVIEWED') {
    bg = 'bg-blue-50 text-blue-700 border-blue-200';
    dot = 'bg-blue-500';
    label = 'Reviewed';
  } else if (norm === 'INVESTIGATING') {
    bg = 'bg-purple-50 text-purple-700 border-purple-200';
    dot = 'bg-purple-500';
    label = 'Investigating';
  } else if (norm === 'DISMISSED') {
    bg = 'bg-slate-100 text-slate-600 border-slate-200';
    dot = 'bg-slate-400';
    label = 'Dismissed';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${norm === 'HIGH_SIGNAL' ? 'animate-ping' : ''}`} />
      <span>{label}</span>
    </span>
  );
};
