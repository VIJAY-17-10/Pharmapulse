import React, { useState } from 'react';
import {
  Package, AlertTriangle, TrendingDown, Search, Filter,
  ChevronDown, RefreshCw, Download, BarChart2, Clock
} from 'lucide-react';

const demoInventory = [
  { id: 1, medicine: 'Oseltamivir 75mg', category: 'Antiviral', zone: 'Zone A', pharmacy: 'HealthPlus Pharmacy', stock: 45, threshold: 150, days_remaining: 3, demand_trend: 'surging', last_updated: '2024-01-16T10:00:00Z', status: 'critical' },
  { id: 2, medicine: 'ORS Sachets', category: 'Rehydration', zone: 'Zone C', pharmacy: 'MediCare Stores', stock: 120, threshold: 200, days_remaining: 6, demand_trend: 'high', last_updated: '2024-01-16T09:30:00Z', status: 'low' },
  { id: 3, medicine: 'Azithromycin 500mg', category: 'Antibiotic', zone: 'Zone F', pharmacy: 'CityMed Pharmacy', stock: 30, threshold: 100, days_remaining: 2, demand_trend: 'surging', last_updated: '2024-01-16T10:15:00Z', status: 'critical' },
  { id: 4, medicine: 'Paracetamol 500mg', category: 'Analgesic', zone: 'Zone B', pharmacy: 'Wellness Pharma', stock: 450, threshold: 300, days_remaining: 18, demand_trend: 'stable', last_updated: '2024-01-16T08:00:00Z', status: 'good' },
  { id: 5, medicine: 'Levocetirizine 5mg', category: 'Antihistamine', zone: 'Zone D', pharmacy: 'QuickMeds', stock: 85, threshold: 120, days_remaining: 5, demand_trend: 'high', last_updated: '2024-01-16T07:45:00Z', status: 'low' },
  { id: 6, medicine: 'Metformin 500mg', category: 'Antidiabetic', zone: 'Zone B', pharmacy: 'Apollo Pharmacy', stock: 320, threshold: 250, days_remaining: 22, demand_trend: 'stable', last_updated: '2024-01-15T18:00:00Z', status: 'good' },
  { id: 7, medicine: 'Amoxicillin 500mg', category: 'Antibiotic', zone: 'Zone E', pharmacy: 'Guardian Pharmacy', stock: 180, threshold: 150, days_remaining: 14, demand_trend: 'stable', last_updated: '2024-01-15T16:30:00Z', status: 'good' },
  { id: 8, medicine: 'Ciprofloxacin 500mg', category: 'Antibiotic', zone: 'Zone A', pharmacy: 'HealthPlus Pharmacy', stock: 60, threshold: 100, days_remaining: 4, demand_trend: 'rising', last_updated: '2024-01-16T10:00:00Z', status: 'low' },
  { id: 9, medicine: 'Hydrocortisone Cream', category: 'Topical', zone: 'Zone C', pharmacy: 'SkinCare Pharmacy', stock: 200, threshold: 80, days_remaining: 30, demand_trend: 'stable', last_updated: '2024-01-15T14:00:00Z', status: 'good' },
  { id: 10, medicine: 'Insulin Glargine', category: 'Antidiabetic', zone: 'Zone F', pharmacy: 'DiaCare Pharmacy', stock: 25, threshold: 50, days_remaining: 3, demand_trend: 'stable', last_updated: '2024-01-16T09:00:00Z', status: 'critical' },
];

const statusConfig: Record<string, { color: string; bg: string; label: string; bar: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', label: 'Critical', bar: 'bg-red-500' },
  low:      { color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30', label: 'Low Stock', bar: 'bg-orange-500' },
  good:     { color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/30', label: 'Adequate', bar: 'bg-green-500' },
};

const trendConfig: Record<string, { color: string; label: string }> = {
  surging: { color: 'text-red-400', label: '🔥 Surging' },
  high:    { color: 'text-orange-400', label: '📈 High' },
  rising:  { color: 'text-yellow-400', label: '↗ Rising' },
  stable:  { color: 'text-green-400', label: '→ Stable' },
};

const InventoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterZone, setFilterZone] = useState('all');
  const [sortBy, setSortBy] = useState<'days_remaining' | 'stock' | 'medicine'>('days_remaining');

  const zones = [...new Set(demoInventory.map(i => i.zone))];

  const filtered = demoInventory
    .filter(item => {
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterZone !== 'all' && item.zone !== filterZone) return false;
      if (search && !item.medicine.toLowerCase().includes(search.toLowerCase()) &&
          !item.category.toLowerCase().includes(search.toLowerCase()) &&
          !item.pharmacy.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'days_remaining') return a.days_remaining - b.days_remaining;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.medicine.localeCompare(b.medicine);
    });

  const stats = {
    critical: demoInventory.filter(i => i.status === 'critical').length,
    low: demoInventory.filter(i => i.status === 'low').length,
    good: demoInventory.filter(i => i.status === 'good').length,
    surging: demoInventory.filter(i => i.demand_trend === 'surging').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Intelligence</h1>
          <p className="text-gray-400 mt-1">Real-time stock levels correlated with demand anomalies</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-semibold">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical Stock', value: stats.critical, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
          { label: 'Low Stock', value: stats.low, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: TrendingDown },
          { label: 'Adequate Stock', value: stats.good, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: Package },
          { label: 'Surging Demand', value: stats.surging, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', icon: BarChart2 },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} border rounded-xl p-4 flex items-center gap-3`}>
              <Icon className={`w-8 h-8 ${stat.color} opacity-70`} />
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search medicine, pharmacy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-500"
          />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="critical">Critical</option>
            <option value="low">Low Stock</option>
            <option value="good">Adequate</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option value="all">All Zones</option>
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="appearance-none bg-white/5 border border-white/10 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500/50 cursor-pointer">
            <option value="days_remaining">Sort: Days Remaining</option>
            <option value="stock">Sort: Stock Level</option>
            <option value="medicine">Sort: Medicine Name</option>
          </select>
          <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="text-gray-500 text-sm flex items-center gap-1 ml-auto">
          <Filter className="w-4 h-4" />
          {filtered.length} items
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-gray-900/80 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Medicine</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Location</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Stock Level</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Days Left</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Demand Trend</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Status</th>
                <th className="text-left text-gray-400 font-semibold py-3 px-4">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(item => {
                const sCfg = statusConfig[item.status];
                const tCfg = trendConfig[item.demand_trend];
                const stockPct = Math.min(100, Math.round((item.stock / item.threshold) * 100));

                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{item.medicine}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{item.category}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-300">{item.pharmacy}</div>
                      <div className="text-gray-500 text-xs">{item.zone}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/10 rounded-full h-2 w-24">
                          <div
                            className={`h-2 rounded-full ${sCfg.bar}`}
                            style={{ width: `${Math.min(100, stockPct)}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold tabular-nums">{item.stock}</span>
                        <span className="text-gray-500">/ {item.threshold}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`font-bold tabular-nums ${item.days_remaining <= 3 ? 'text-red-400' : item.days_remaining <= 7 ? 'text-orange-400' : 'text-green-400'}`}>
                        {item.days_remaining}d
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-semibold ${tCfg.color}`}>{tCfg.label}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${sCfg.bg} ${sCfg.color}`}>
                        {sCfg.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(item.last_updated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No inventory items match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
