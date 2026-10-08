import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from 'recharts';
import { Filter, Calendar, AlertCircle } from 'lucide-react';
import { TrendPoint } from '../types';

interface TrendChartProps {
  data: TrendPoint[];
  selectedCategory: string;
  selectedTimeframe: string;
  onCategoryChange: (cat: string) => void;
  onTimeframeChange: (tf: string) => void;
}

const CATEGORIES = [
  'Respiratory',
  'Fever',
  'Digestive',
  'Pain Relief',
  'Allergy',
  'ORS/Hydration',
];

const TIMEFRAMES = ['Today', '7 Days', '30 Days', '90 Days'];

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  selectedCategory,
  selectedTimeframe,
  onCategoryChange,
  onTimeframeChange,
}) => {
  // Filter data by current category if not all
  const filteredData = data.filter(
    (d) => !selectedCategory || selectedCategory === 'All Categories' || d.category === selectedCategory
  );

  // Custom interactive tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as TrendPoint;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <span className="font-semibold text-slate-300">{point.date}</span>
            <span className="text-teal-400 font-bold">{point.category}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Actual Demand:</span>
            <strong className="text-white text-sm">{point.actual_demand} units</strong>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Expected Baseline:</span>
            <span className="text-slate-400">{point.expected_demand} units</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Deviation:</span>
            <span
              className={`font-bold ${
                point.deviation_pct > 25
                  ? 'text-rose-400'
                  : point.deviation_pct > 10
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {point.deviation_pct > 0 ? `+${point.deviation_pct}%` : `${point.deviation_pct}%`}
            </span>
          </div>

          {point.is_anomaly && (
            <div className="mt-1 pt-1 text-[11px] text-rose-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span>Statistical Anomaly Flagged</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft p-5">
      {/* Header with Title and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Medicine Demand Trends</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated point-of-sale volume against adaptive rolling historical baseline
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All Categories">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe pill buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedTimeframe === tf
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts chart */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
            />

            {/* Expected Baseline Line */}
            <Line
              type="monotone"
              dataKey="expected_demand"
              name="Expected Baseline"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* Actual Demand Line with Area */}
            <Area
              type="monotone"
              dataKey="actual_demand"
              name="Actual Demand"
              stroke="#0D9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#actualGradient)"
              activeDot={{ r: 6, fill: '#0D9488', stroke: '#FFFFFF', strokeWidth: 2 }}
            />

            {/* Anomaly Scatter Points */}
            <Scatter
              dataKey={(d: TrendPoint) => (d.is_anomaly ? d.actual_demand : null)}
              name="Detected Anomaly"
              fill="#E11D48"
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend footnote */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" /> Actual Demand
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 border-b-2 border-dashed border-slate-400 inline-block" /> 7-Day Rolling Baseline
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Anomaly Point (&gt;2.5σ)
          </span>
        </div>
        <span className="italic text-slate-400">Hover any point for exact deviations</span>
      </div>
    </div>
  );
};
