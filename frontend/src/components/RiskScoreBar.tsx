import React from 'react';

interface RiskScoreBarProps {
  score: number;
  breakdown?: {
    spikeMagnitude?: number;
    timePersistence?: number;
    geographicConcentration?: number;
    crossCategory?: number;
  };
  showBreakdown?: boolean;
}

export const RiskScoreBar: React.FC<RiskScoreBarProps> = ({
  score,
  breakdown,
  showBreakdown = true,
}) => {
  // Classification
  let color = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let classification = 'Normal (0–30)';

  if (score >= 81) {
    color = 'bg-rose-500';
    textColor = 'text-rose-700';
    classification = 'High Signal (81–100)';
  } else if (score >= 61) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
    classification = 'Alert (61–80)';
  } else if (score >= 31) {
    color = 'bg-yellow-500';
    textColor = 'text-yellow-700';
    classification = 'Watch (31–60)';
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700">Composite Risk Score</span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-black ${textColor}`}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
          <span className="text-xs font-semibold text-slate-500 ml-2">[{classification}]</span>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
        />
      </div>

      {/* Breakdown breakdown cards */}
      {showBreakdown && breakdown && (
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Spike Magnitude</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {breakdown.spikeMagnitude ?? 30.3} <span className="text-[10px] text-slate-400 font-normal">/ 35%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded mt-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded"
                style={{ width: `${((breakdown.spikeMagnitude ?? 30.3) / 35) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Time Persistence</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {breakdown.timePersistence ?? 14.3} <span className="text-[10px] text-slate-400 font-normal">/ 25%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded mt-1.5 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded"
                style={{ width: `${((breakdown.timePersistence ?? 14.3) / 25) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Geographic Pattern</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {breakdown.geographicConcentration ?? 18.7} <span className="text-[10px] text-slate-400 font-normal">/ 20%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded mt-1.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded"
                style={{ width: `${((breakdown.geographicConcentration ?? 18.7) / 20) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Cross-Category Link</div>
            <div className="text-sm font-bold text-slate-800 mt-0.5">
              {breakdown.crossCategory ?? 18.7} <span className="text-[10px] text-slate-400 font-normal">/ 20%</span>
            </div>
            <div className="w-full bg-slate-200 h-1 rounded mt-1.5 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded"
                style={{ width: `${((breakdown.crossCategory ?? 18.7) / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
