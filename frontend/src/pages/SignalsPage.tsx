import React, { useState } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, Filter, Eye, TrendingUp,
  MapPin, Calendar, Activity, ChevronDown, X, RefreshCw
} from 'lucide-react';

const demoSignals = [
  {
    id: 'SIG-2024-001',
    medicine: 'Oseltamivir (Tamiflu)',
    category: 'Antiviral',
    zone: 'Zone A – North Delhi',
    pharmacies_affected: 12,
    avg_demand_increase: 340,
    baseline_demand: 45,
    current_demand: 198,
    risk_level: 'critical',
    status: 'open',
    detected_at: '2024-01-15T08:30:00Z',
    reviewed_by: null,
    notes: null,
    possible_cause: 'Seasonal influenza cluster detected in neighboring districts',
    confidence: 92,
  },
  {
    id: 'SIG-2024-002',
    medicine: 'ORS Sachets',
    category: 'Rehydration',
    zone: 'Zone C – East Delhi',
    pharmacies_affected: 8,
    avg_demand_increase: 220,
    baseline_demand: 30,
    current_demand: 96,
    risk_level: 'high',
    status: 'under_review',
    detected_at: '2024-01-14T14:15:00Z',
    reviewed_by: 'Dr. Priya Sharma',
    notes: 'Gastroenteritis cases reported at local school',
    possible_cause: 'GI illness cluster in school-age population',
    confidence: 85,
  },
  {
    id: 'SIG-2024-003',
    medicine: 'Metformin 500mg',
    category: 'Antidiabetic',
    zone: 'Zone B – South Delhi',
    pharmacies_affected: 5,
    avg_demand_increase: 45,
    baseline_demand: 200,
    current_demand: 290,
    risk_level: 'medium',
    status: 'resolved',
    detected_at: '2024-01-12T09:00:00Z',
    reviewed_by: 'Mr. Rajesh Kumar',
    notes: 'Supply shortage at distributor level. No outbreak concern.',
    possible_cause: 'Supply chain disruption',
    confidence: 71,
  },
  {
    id: 'SIG-2024-004',
    medicine: 'Levocetirizine',
    category: 'Antihistamine',
    zone: 'Zone D – West Delhi',
    pharmacies_affected: 18,
    avg_demand_increase: 180,
    baseline_demand: 80,
    current_demand: 224,
    risk_level: 'high',
    status: 'open',
    detected_at: '2024-01-16T06:45:00Z',
    reviewed_by: null,
    notes: null,
    possible_cause: 'Elevated pollen count; seasonal allergy uptick',
    confidence: 78,
  },
  {
    id: 'SIG-2024-005',
    medicine: 'Azithromycin 500mg',
    category: 'Antibiotic',
    zone: 'Zone F – Central Delhi',
    pharmacies_affected: 9,
    avg_demand_increase: 265,
    baseline_demand: 60,
    current_demand: 219,
    risk_level: 'critical',
    status: 'open',
    detected_at: '2024-01-16T10:00:00Z',
    reviewed_by: null,
    notes: null,
    possible_cause: 'Respiratory illness spike — antibiotic overuse risk',
    confidence: 89,
  },
  {
    id: 'SIG-2024-006',
    medicine: 'Pantoprazole 40mg',
    category: 'GI',
    zone: 'Zone E – South-West Delhi',
    pharmacies_affected: 4,
    avg_demand_increase: 38,
    baseline_demand: 150,
    current_demand: 207,
    risk_level: 'low',
    status: 'resolved',
    detected_at: '2024-01-11T11:20:00Z',
    reviewed_by: 'Dr. Anita Verma',
    notes: 'Routine seasonal increase. No action required.',
    possible_cause: 'Post-festive dietary patterns',
    confidence: 62,
  },
];

const riskConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertTriangle, label: 'Critical' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: TrendingUp, label: 'High' },
  medium:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Activity, label: 'Medium' },
  low:      { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'Low' },
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  open:         { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Open' },
  under_review: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Under Review' },
  resolved:     { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Resolved' },
};

type Signal = typeof demoSignals[0];

const SignalDetailModal: React.FC<{ signal: Signal; onClose: () => void; onResolve: (id: string) => void }> = ({ signal, onClose, onResolve }) => {
  const rCfg = riskConfig[signal.risk_level];
  const sCfg = statusConfig[signal.status];
  const RiskIcon = rCfg.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${rCfg.bg}`}>
              <RiskIcon className={`w-5 h-5 ${rCfg.color}`} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">{signal.id}</h2>
              <p className="text-gray-400 text-sm">{signal.medicine}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Disclaimer */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-300 text-xs">
            ⚠️ <strong>Decision Support Only:</strong> Potential anomaly detected — verification recommended.
            This is NOT a confirmed disease outbreak. Please investigate through standard public health channels.
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">+{signal.avg_demand_increase}%</div>
              <div className="text-gray-400 text-xs mt-1">Demand Increase</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{signal.pharmacies_affected}</div>
              <div className="text-gray-400 text-xs mt-1">Pharmacies Affected</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-white">{signal.confidence}%</div>
              <div className="text-gray-400 text-xs mt-1">AI Confidence</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Category</span>
              <span className="text-white">{signal.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Zone</span>
              <span className="text-white">{signal.zone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Baseline Demand</span>
              <span className="text-white">{signal.baseline_demand} units/day</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Current Demand</span>
              <span className={`font-bold ${rCfg.color}`}>{signal.current_demand} units/day</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Risk Level</span>
              <span className={`font-semibold ${rCfg.color}`}>{rCfg.label}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Status</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sCfg.bg} ${sCfg.color}`}>{sCfg.label}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Detected At</span>
              <span className="text-white">{new Date(signal.detected_at).toLocaleString('en-IN')}</span>
            </div>
            <div className="py-2 border-b border-white/5">
              <div className="text-gray-400 mb-1">Possible Cause (AI Hypothesis)</div>
              <div className="text-white">{signal.possible_cause}</div>
            </div>
            {signal.reviewed_by && (
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Reviewed By</span>
                <span className="text-white">{signal.reviewed_by}</span>
              </div>
            )}
            {signal.notes && (
              <div className="py-2">
                <div className="text-gray-400 mb-1">Review Notes</div>
                <div className="text-white bg-white/5 rounded p-2">{signal.notes}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          {signal.status !== 'resolved' && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { onResolve(signal.id); onClose(); }}
                className="flex-1 py-2.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-semibold text-sm"
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Mark as Resolved
              </button>
              <button className="flex-1 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-semibold text-sm">
                <Eye className="w-4 h-4 inline mr-2" />
                Assign for Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignalsPage: React.FC = () => {
  const [signals, setSignals] = useState(demoSignals);
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const filtered = signals.filter(s => {
    if (filterRisk !== 'all' && s.risk_level !== filterRisk) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  const handleResolve = (id: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, status: 'resolved', reviewed_by: 'Current User' } : s));
  };

  const stats = {
    total: signals.length,
    open: signals.filter(s => s.status === 'open').length,
    critical: signals.filter(s => s.risk_level === 'critical').length,
    resolved: signals.filter(s => s.status === 'resolved').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Anomaly Signals</h1>
          <p className="text-gray-400 mt-1">AI-detected demand anomalies requiring attention</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-semibold">
          <RefreshCw className="w-4 h-4" />
          Refresh Signals
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Decision-Support System:</strong> These signals indicate <em>potential</em> anomalies in pharmacy demand data.
          They are NOT confirmed disease outbreaks. Always verify through established public health surveillance channels before taking action.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Signals', value: stats.total, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Open', value: stats.open, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Critical Risk', value: stats.critical, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border border-white/10 rounded-xl p-4 text-center`}>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm ml-auto">
          <Filter className="w-4 h-4" />
          Showing {filtered.length} of {signals.length} signals
        </div>
      </div>

      {/* Signal List */}
      <div className="space-y-3">
        {filtered.map(signal => {
          const rCfg = riskConfig[signal.risk_level];
          const sCfg = statusConfig[signal.status];
          const RiskIcon = rCfg.icon;

          return (
            <div
              key={signal.id}
              className={`bg-gray-900/80 border rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer group ${rCfg.bg}`}
              onClick={() => setSelectedSignal(signal)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0`}>
                    <RiskIcon className={`w-5 h-5 ${rCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-white font-semibold">{signal.medicine}</h3>
                      <span className="text-gray-500 text-xs">{signal.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${sCfg.bg} ${sCfg.color}`}>{sCfg.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {signal.zone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(signal.detected_at).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" />
                        {signal.pharmacies_affected} pharmacies
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-1">{signal.possible_cause}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className={`text-2xl font-bold ${rCfg.color}`}>+{signal.avg_demand_increase}%</div>
                  <div className="text-gray-500 text-xs">demand spike</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {signal.confidence}% confidence
                  </div>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-semibold group-hover:bg-blue-500/30 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No signals match the selected filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
};

export default SignalsPage;
