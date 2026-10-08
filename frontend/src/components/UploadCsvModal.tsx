import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2, Download, RefreshCw, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface UploadCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (results: any) => void;
}

export const UploadCsvModal: React.FC<UploadCsvModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.name.endsWith('.csv')) {
        setFile(dropped);
        setError(null);
      } else {
        setError('Only .csv files are supported.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.name.endsWith('.csv')) {
        setFile(selected);
        setError(null);
      } else {
        setError('Only .csv files are supported.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a valid CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.uploadCsv(file);
      setUploadResult(res);
      onUploadSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Failed to process CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      'date,pharmacy_id,zone,category,quantity,stock_level\n' +
      '2026-10-07,PH-001,Zone 4,Respiratory,195,35\n' +
      '2026-10-07,PH-002,Zone 4,Respiratory,210,28\n' +
      '2026-10-07,PH-003,Zone 4,Respiratory,188,40\n' +
      '2026-10-07,PH-004,Zone 4,Respiratory,230,22\n' +
      '2026-10-07,PH-005,Zone 4,Respiratory,205,31\n' +
      '2026-10-07,PH-001,Zone 4,Cough/Cold,170,45\n' +
      '2026-10-07,PH-010,Zone 1,Fever,92,85\n' +
      '2026-10-07,PH-011,Zone 1,Fever,88,90\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pharmapulse_sample_demand.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Upload Pharmacy Demand CSV</h3>
              <p className="text-xs text-slate-400">Validate schema & run instant AI anomaly detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!uploadResult ? (
            <>
              {/* Drag & drop upload area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {file ? file.name : 'Drag & drop your CSV file here, or browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Required columns: <code>date, pharmacy_id, zone, category, quantity, stock_level</code>
                </p>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Sample CSV
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
                <span className="font-semibold block text-slate-700 mb-1">Privacy Guarantee:</span>
                Do not include patient identifiers (names, contact numbers, addresses, prescriptions). Only aggregated daily retail medicine quantities and stock percentages are permitted.
              </div>
            </>
          ) : (
            /* Results preview */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">{uploadResult.message}</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {uploadResult.records_processed} records processed • {uploadResult.anomalies_detected} anomalies detected • {uploadResult.new_signals_generated} new signals generated.
                  </p>
                </div>
              </div>

              {/* Detected signals preview */}
              {uploadResult.signals && uploadResult.signals.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    Generated Surveillance Signals
                  </h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadResult.signals.map((sig: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-slate-900 block">{sig.title}</strong>
                          <span className="text-slate-500">
                            {sig.zone} • Demand +{sig.demand_change}% • {sig.pharmacies_affected} pharmacies
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 font-bold rounded">
                          Risk {sig.risk_score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setFile(null);
                  setUploadResult(null);
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Upload another file
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            {uploadResult ? 'Done' : 'Cancel'}
          </button>
          {!uploadResult && (
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing ML Pipeline...
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  Process & Detect Anomalies
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
