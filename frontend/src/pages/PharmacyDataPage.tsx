import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  UploadCloud,
  Download,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { PharmacySalesRecord } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { UploadCsvModal } from '../components/UploadCsvModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';

interface PharmacyDataPageProps {
  showToast: (type: 'success' | 'warning' | 'info' | 'error', message: string, title?: string) => void;
}

const ZONES = ['All Zones', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10'];
const CATEGORIES = ['All Categories', 'Respiratory', 'Fever', 'Digestive', 'Pain Relief', 'Allergy', 'ORS/Hydration', 'Cough/Cold', 'Antibiotic', 'Antacid', 'Dermatological'];

export const PharmacyDataPage: React.FC<PharmacyDataPageProps> = ({ showToast }) => {
  const [records, setRecords] = useState<PharmacySalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');

  // Modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await api.getSalesData({
        page,
        limit,
        zone: selectedZone === 'All Zones' ? undefined : selectedZone,
        category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
        search: search.trim() || undefined,
        sort_by: sortBy,
        order,
      });
      setRecords(data.records);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch sales records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, selectedZone, selectedCategory, sortBy, order]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleUploadSuccess = (result: any) => {
    showToast(
      'success',
      `Processed ${result.records_processed} records. ${result.new_signals_generated} new signals identified.`,
      'CSV Processed Successfully'
    );
    fetchRecords();
  };

  const handleDownloadSample = () => {
    window.location.href = api.getSampleCsvUrl();
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pharmacy Telemetry Ledger</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Point-of-sale aggregated transactional units and retail inventory reserves.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sample CSV</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, zone, category..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </form>

          {/* Zone Selector */}
          <div>
            <select
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="date">Sort: Date</option>
              <option value="quantity">Sort: Quantity</option>
              <option value="stock_level">Sort: Stock Level</option>
            </select>
            <button
              onClick={() => setOrder(order === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title={`Order: ${order.toUpperCase()}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Filtering pharmacy transaction streams..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">Pharmacy ID</th>
                    <th className="px-5 py-3.5">Zone</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 text-right">Quantity</th>
                    <th className="px-5 py-3.5 text-center">Stock Level</th>
                    <th className="px-5 py-3.5 text-right">Anomaly Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                        No transactions match your current filters.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr
                        key={r.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          r.status === 'Alert' ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          {r.pharmacy_code}
                          <span className="block text-[10px] font-normal text-slate-400">
                            {r.pharmacy_name}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium">{r.zone}</td>
                        <td className="px-5 py-3.5 text-slate-500">{r.date}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                            {r.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-extrabold text-slate-900">
                          {r.quantity}
                          {r.expected_quantity > 0 && (
                            <span className="block text-[10px] font-normal text-slate-400">
                              Exp: {r.expected_quantity}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`font-bold ${
                              r.raw_stock_level < 40 ? 'text-rose-600' : 'text-slate-700'
                            }`}
                          >
                            {r.stock_level}
                          </span>
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                r.raw_stock_level < 40 ? 'bg-rose-500' : 'bg-teal-600'
                              }`}
                              style={{ width: `${r.raw_stock_level}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <RiskBadge status={r.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-900">{(page - 1) * limit + 1}</strong> to{' '}
                <strong className="text-slate-900">{Math.min(page * limit, total)}</strong> of{' '}
                <strong className="text-slate-900">{total}</strong> records
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CSV Upload Modal */}
      <UploadCsvModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};
