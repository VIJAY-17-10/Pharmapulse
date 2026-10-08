import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trendPct?: number;
  trendLabel?: string;
  description: string;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'rose' | 'amber' | 'teal' | 'emerald';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trendPct,
  trendLabel,
  description,
  subtext,
  icon: Icon,
  variant = 'blue',
}) => {
  const iconVariants = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    rose: 'bg-rose-50 text-rose-600 ring-rose-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
    teal: 'bg-teal-50 text-teal-600 ring-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  };

  const isPositive = (trendPct ?? 0) > 0;
  const isNegative = (trendPct ?? 0) < 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            {subtext && (
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {subtext}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ring-4 ${iconVariants[variant]} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {trendPct !== undefined && trendPct !== 0 ? (
            <>
              {isPositive ? (
                <span className="text-rose-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{trendPct}%
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  {trendPct}%
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 flex items-center gap-0.5">
              <Minus className="w-3.5 h-3.5" />
              Nominal
            </span>
          )}
          {trendLabel && <span className="text-slate-400 font-normal">({trendLabel})</span>}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{description}</p>
    </div>
  );
};
