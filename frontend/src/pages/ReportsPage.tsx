import React, { useState } from 'react';
import {
  FileText, Download, Calendar, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Filter, Eye, ChevronDown, Share2, RefreshCw
} from 'lucide-react';

const demoReports = [
  {
    id: 'RPT-2024-016',
    title: 'Weekly Anomaly Summary — Week 3, January 2024',
    type: 'weekly_summary',
    zone: 'All Zones',
    generated_at: '2024-01-15T18:00:00Z',
    generated_by: 'System (Auto)',
    signals_included: 6,
    critical_count: 2,
    status: 'final',
    size_kb: 245,
    summary: 'Influenza-related demand surge detected in North Delhi. ORS spike in East Delhi under review. 2 critical signals escalated to public health authorities.',
  },
  {
    id: 'RPT-2024-015',
    title: 'Zone A Antibiotic Demand Analysis',
    type: 'zone_specific',
    zone: 'Zone A – North Delhi',
    generated_at: '2024-01-14T12:30:00Z',
    generated_by: 'Dr. Priya Sharma',
    signals_included: 3,
    critical_count: 1,
    status: 'final',
    size_kb: 189,
    summary: 'Elevated antibiotic prescriptions — cross-correlated with flu season data. Recommended surveillance enhancement.',
  },
  {
    id: 'RPT-2024-014',
    title: 'Monthly Trend Report — December 2023',
    type: 'monthly_trend',
    zone: 'All Zones',
    generated_at: '2024-01-01T09:00:00Z',
    generated_by: 'System (Auto)',
    signals_included: 18,
    critical_count: 3,
    status: 'final',
    size_kb: 512,
    summary: 'December saw 3 critical anomalies. Paracetamol and cough suppressants at seasonal peak. No confirmed outbreak. All resolved.',
  },
  {
    id: 'RPT-2024-013',
    title: 'Oseltamivir Spike — Root Cause Analysis',
    type: 'root_cause',
    zone: 'Zone A – North Delhi',
    generated_at: '2024-01-12T15:45:00Z',
    generated_by: 'Mr. Rajesh Kumar',
    signals_included: 1,
    critical_count: 1,
    status: 'draft',
    size_kb: 134,
    summary: 'Demand spike of 340% over 48 hours. AI analysis points to early influenza cluster. Submitted to district health officer.',
  },
  {
    id: 'RPT-2024-012',
    title: 'Inventory Depletion Risk Assessment',
    type: 'inventory_risk',
    zone: 'All Zones',
    generated_at: '2024-01-10T10:00:00Z',
    generated_by: 'System (Auto)',
    signals_included: 4,
    critical_count: 0,
    status: 'final',
    size_kb: 98,
    summary: '4 medicines flagged for potential stock-out within 7 days during surge events. Replenishment recommendations issued.',
  },
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  weekly_summary:  { label: 'Weekly Summary', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  monthly_trend:   { label: 'Monthly Trend', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  zone_specific:   { label: 'Zone Analysis', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  root_cause:      { label: 'Root Cause', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  inventory_risk:  { label: 'Inventory Risk', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  final: { label: 'Final', color: 'text-green-400', icon: CheckCircle },
  draft: { label: 'Draft', color: 'text-yellow-400', icon: Clock },
};

const ReportsPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [newReportType, setNewReportType] = useState('weekly_summary');

  const filtered = demoReports.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowGenerateModal(false);
      alert('✅ Report generated successfully! (Demo — no file was written)');
    }, 2000);
  };

  const stats = {
    total: demoReports.length,
    thisWeek: 2,
    critical_signals: demoReports.reduce((s, r) => s + r.critical_count, 0),
    finalized: demoReports.filter(r => r.status === 'final').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Audit Trail</h1>
          <p className="text-gray-400 mt-1">Generated surveillance reports for health authorities</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all text-sm font-bold shadow-lg"
        >
          <FileText className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'This Week', value: stats.thisWeek, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Critical Signals', value: stats.critical_signals, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Finalized', value: stats.finalized, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-white/10 rounded-xl p-4 text-center`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option value="all">All Types</option>
            {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="final">Final</option>
            <option value="draft">Draft</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="text-gray-500 text-sm flex items-center gap-1 ml-auto">
          <Filter className="w-4 h-4" />
          {filtered.length} reports
        </div>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        {filtered.map(report => {
          const tCfg = typeConfig[report.type];
          const sCfg = statusConfig[report.status];
          const StatusIcon = sCfg.icon;

          return (
            <div key={report.id} className="bg-gray-900/80 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tCfg.bg} ${tCfg.color}`}>{tCfg.label}</span>
                    <span className="text-gray-500 text-xs font-mono">{report.id}</span>
                    <span className={`flex items-center gap-1 text-xs ${sCfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {sCfg.label}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-base leading-snug">{report.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{report.summary}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.generated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span>By: {report.generated_by}</span>
                    <span>{report.zone}</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {report.signals_included} signals
                    </span>
                    {report.critical_count > 0 && (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {report.critical_count} critical
                      </span>
                    )}
                    <span>{report.size_kb} KB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-xs font-semibold">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-xs font-semibold">
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-bold text-lg">Generate New Report</h2>
              <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Report Type</label>
                <div className="relative">
                  <select value={newReportType} onChange={e => setNewReportType(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
                    {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" defaultValue="2024-01-01"
                    className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50" />
                  <input type="date" defaultValue="2024-01-16"
                    className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Zone</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
                    <option value="all">All Zones</option>
                    <option value="zone_a">Zone A – North Delhi</option>
                    <option value="zone_b">Zone B – South Delhi</option>
                    <option value="zone_c">Zone C – East Delhi</option>
                    <option value="zone_d">Zone D – West Delhi</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-blue-300 text-xs">
                ℹ️ Reports include only aggregated, de-identified pharmacy demand data. No patient information is included.
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><FileText className="w-4 h-4" />Generate Report</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
