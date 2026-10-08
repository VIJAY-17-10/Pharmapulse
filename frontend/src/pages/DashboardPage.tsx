import React, { useState, useEffect } from 'react';
import {
  BellRing,
  AlertTriangle,
  Store,
  MapPin,
  Target,
  Clock,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { TrendChart } from '../components/TrendChart';
import { SignalCard } from '../components/SignalCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SignalItem, TrendPoint } from '../types';
import { api } from '../services/api';

interface DashboardPageProps {
  onViewSignalDetails: (signal: SignalItem) => void;
  onNavigateTab: (tab: string) => void;
  onTriggerDemo: () => void;
  showToast: (type: 'success' | 'warning' | 'info' | 'error', message: string, title?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onViewSignalDetails,
  onNavigateTab,
  onTriggerDemo,
  showToast,
}) => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
  const [recentSignals, setRecentSignals] = useState<SignalItem[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Respiratory');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30 Days');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getDashboard();
      setKpis(data.kpis);
      setRecentSignals(data.recent_signals || []);
      setTrends(data.trends || []);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefreshTrends = async (timeframe: string, category: string) => {
    setSelectedTimeframe(timeframe);
    setSelectedCategory(category);
    try {
      const newTrends = await api.getTrends(timeframe, category);
      setTrends(newTrends);
    } catch (err) {
      console.error('Trend fetch error:', err);
    }
  };

  const handleMarkReviewed = async (signal: SignalItem) => {
    try {
      await api.reviewSignal(signal.id, 'REVIEWED', 'Verified by Health Officer via dashboard triage.');
      showToast('success', `Signal #${signal.id} marked as reviewed.`, 'Triage Updated');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Could not update signal.', 'Error');
    }
  };

  const handleInvestigate = async (signal: SignalItem) => {
    try {
      await api.assignSignal(signal.id, 'Priya Sundaram (IDSP Officer)', 'Active field team dispatch recommended.');
      showToast('info', `Signal #${signal.id} moved to Investigating state.`, 'Investigation Initiated');
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Could not assign signal.', 'Error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Aggregating public-health surveillance telemetry..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Public Health Intelligence</h1>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
              Live Feed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor aggregated pharmacy-demand patterns and identify unusual signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setRefreshing(true);
              loadData();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>

          <button
            onClick={onTriggerDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trigger Demo Scenario</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Active Signals"
          value={kpis?.active_signals?.value ?? 12}
          trendPct={kpis?.active_signals?.trend_pct ?? 14.2}
          trendLabel={kpis?.active_signals?.trend_label ?? '+2 from yesterday'}
          description="Signals currently pending review or under verification"
          icon={BellRing}
          variant="amber"
        />

        <KpiCard
          title="Critical Signals"
          value={kpis?.critical_signals?.value ?? 2}
          trendPct={kpis?.critical_signals?.trend_pct ?? 0}
          trendLabel="Zone 4 & Zone 7"
          description="High-signal anomalies requiring immediate verification"
          icon={AlertTriangle}
          variant="rose"
        />

        <KpiCard
          title="Pharmacies Monitored"
          value={kpis?.pharmacies_monitored?.value ?? 148}
          trendPct={kpis?.pharmacies_monitored?.trend_pct ?? 5.4}
          trendLabel="100% online"
          description="Aggregated retail & community pharmacy touchpoints"
          subtext="Zero PII"
          icon={Store}
          variant="teal"
        />

        <KpiCard
          title="Areas Monitored"
          value={kpis?.areas_monitored?.value ?? 24}
          trendPct={0}
          trendLabel="Chennai Wards"
          description="Metropolitan municipal administrative health zones"
          icon={MapPin}
          variant="blue"
        />

        <KpiCard
          title="Detection Accuracy"
          value={kpis?.detection_accuracy?.value ?? '91.4%'}
          trendPct={2.1}
          trendLabel="Benchmark"
          description="Historical anomaly recall against synthetic benchmarks"
          subtext="Prototype evaluation"
          icon={Target}
          variant="emerald"
        />

        <KpiCard
          title="Average Detection Time"
          value={kpis?.average_detection_time?.value ?? '4.2 hours'}
          trendPct={-18.5}
          trendLabel="-1.1h vs logs"
          description="Latency from aggregation to early alert generation"
          icon={Clock}
          variant="blue"
        />
      </div>

      {/* Medicine Demand Trends Line Chart */}
      <TrendChart
        data={trends}
        selectedCategory={selectedCategory}
        selectedTimeframe={selectedTimeframe}
        onCategoryChange={(c) => handleRefreshTrends(selectedTimeframe, c)}
        onTimeframeChange={(tf) => handleRefreshTrends(tf, selectedCategory)}
      />

      {/* AI Detected Signals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>AI Detected Signals</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {recentSignals.length} Active
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statistically significant demand surges ranked by composite risk score
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('signals')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
          >
            View All Signals →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onViewDetails={onViewSignalDetails}
              onInvestigate={handleInvestigate}
              onMarkReviewed={handleMarkReviewed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
