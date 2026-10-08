import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Brain,
  Layers,
  ArrowRight,
  Target,
  BarChart2,
  GitBranch,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Workflow,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AiAnalyticsData } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { api } from '../services/api';

export const AiAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AiAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalyticsOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner message="Benchmarking machine learning anomaly detection telemetry..." />;
  }

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600 border border-purple-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Analytics Engine</h1>
              <p className="text-xs text-slate-500">
                Hybrid spatial-temporal anomaly detection and multi-category correlation architecture.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Model: Hybrid Anomaly Detection
          </span>
        </div>
      </div>

      {/* 5 Performance Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Anomalies Detected
          </span>
          <div className="text-2xl font-black text-slate-900">{data.metrics.anomalies_detected}</div>
          <span className="text-[10px] text-teal-600 mt-1 block">Active Telemetry Count</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            False-Positive Rate
          </span>
          <div className="text-2xl font-black text-emerald-600">{data.metrics.false_positive_rate}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Low noise threshold</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Precision
          </span>
          <div className="text-2xl font-black text-blue-600">{data.metrics.precision}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Validated surge hits</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Recall
          </span>
          <div className="text-2xl font-black text-teal-600">{data.metrics.recall}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">True anomaly capture</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-soft col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            F1 Score
          </span>
          <div className="text-2xl font-black text-purple-600">{data.metrics.f1_score}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Harmonic mean balance</span>
        </div>
      </div>

      {/* Detection Methods Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          Ensemble Anomaly Detection Methods
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {data.methods.map((method, i) => (
            <div
              key={i}
              className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:bg-white hover:shadow-card transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs mb-2.5">
                0{i + 1}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{method.name}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{method.role}</p>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {method.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Model Performance Comparison Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Comparative Benchmark Evaluation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating individual detectors against the PharmaPulse Hybrid Architecture
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Synthetic Evaluation</span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.model_comparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="method" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontSize: '11px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="precision" name="Precision %" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" name="Recall %" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="f1" name="F1 Score %" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detection Pipeline Step Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-teal-600" />
          End-to-End Detection Pipeline
        </h3>

        <div className="flex flex-col lg:flex-row items-stretch gap-2.5">
          {data.detection_pipeline.map((step, idx) => (
            <React.Fragment key={step.step}>
              <div className="flex-1 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs hover:border-teal-400 transition-colors">
                <div className="flex items-center gap-1.5 font-bold text-teal-700 mb-1">
                  <span>Step {step.step}</span>
                </div>
                <h5 className="font-bold text-slate-900 mb-1">{step.name}</h5>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>

              {idx < data.detection_pipeline.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mathematical Risk Score Formulation */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Mathematical Formulation & Classification Scale
        </div>

        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 font-mono text-xs sm:text-sm text-teal-200 leading-relaxed overflow-x-auto">
          {data.formula.equation}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">0–30 Score</span>
            <strong className="text-emerald-400 font-bold text-sm">Normal</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Nominal seasonal variance</p>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">31–60 Score</span>
            <strong className="text-yellow-400 font-bold text-sm">Watch</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Mild multi-counter elevation</p>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">61–80 Score</span>
            <strong className="text-amber-400 font-bold text-sm">Alert</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Cross-category confirmed rise</p>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-slate-400 block">81–100 Score</span>
            <strong className="text-rose-400 font-bold text-sm">High Signal</strong>
            <p className="text-[10px] text-slate-400 mt-0.5">Significant persistent cluster</p>
          </div>
        </div>

        {/* Prototype Parameter Notice */}
        <div className="p-3 bg-slate-800/60 rounded-xl border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Prototype Parameter Notice:</strong> {data.formula.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
