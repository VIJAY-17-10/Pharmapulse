import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import {
  MapPin,
  Filter,
  Calendar,
  Layers,
  Store,
  AlertTriangle,
  ArrowUpRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { MapZoneSignal } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { api } from '../services/api';

interface MapPageProps {
  onSelectZoneSignal?: (signalId: number) => void;
  showToast: (type: 'success' | 'warning' | 'info' | 'error', message: string, title?: string) => void;
}

const CATEGORIES = [
  'All Categories',
  'Respiratory',
  'Fever',
  'Digestive',
  'Allergy',
  'Pain Relief',
];

const DATE_RANGES = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

// Component to handle map view adjustments
function MapCenterController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const MapPage: React.FC<MapPageProps> = ({ onSelectZoneSignal, showToast }) => {
  const [zones, setZones] = useState<MapZoneSignal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');
  const [selectedZone, setSelectedZone] = useState<MapZoneSignal | null>(null);
  const [loading, setLoading] = useState(true);

  // Default Center: Chennai Municipal Center [13.0418, 80.2341]
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0418, 80.2341]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await api.getMapSignals(
          selectedCategory === 'All Categories' ? undefined : selectedCategory
        );
        setZones(data);
        if (data.length > 0 && !selectedZone) {
          // Default select the zone with highest risk
          const highest = [...data].sort((a, b) => b.risk_score - a.risk_score)[0];
          setSelectedZone(highest);
        }
      } catch (err) {
        console.error('Error fetching map signals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, [selectedCategory, selectedDateRange]);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'High Signal':
        return { fill: '#E11D48', stroke: '#9F1239' }; // Red
      case 'Alert':
        return { fill: '#F97316', stroke: '#C2410C' }; // Orange
      case 'Watch':
        return { fill: '#FBBF24', stroke: '#D97706' }; // Yellow
      default:
        return { fill: '#10B981', stroke: '#047857' }; // Green
    }
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Geographic Signal Intelligence</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial distribution of pharmacy clusters across Chennai Municipal Zones.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="text-xs font-semibold bg-transparent text-slate-800 focus:outline-none"
            >
              {DATE_RANGES.map((dr) => (
                <option key={dr} value={dr}>
                  {dr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map + Detail Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden h-[480px] sm:h-[540px] relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <MapCenterController center={mapCenter} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {zones.map((z) => {
              const colors = getMarkerColor(z.status);
              const isSelected = selectedZone?.zone === z.zone;
              const radius = z.status === 'High Signal' ? 22 : z.status === 'Alert' ? 18 : 14;

              return (
                <CircleMarker
                  key={z.zone}
                  center={[z.latitude, z.longitude]}
                  radius={radius}
                  pathOptions={{
                    fillColor: colors.fill,
                    fillOpacity: 0.85,
                    color: colors.stroke,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedZone(z);
                      setMapCenter([z.latitude, z.longitude]);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs space-y-1">
                      <strong className="block text-slate-900 font-bold">{z.zone} ({z.area_name})</strong>
                      <span className="text-slate-500 block">Status: <strong>{z.status}</strong></span>
                      <span className="text-slate-500 block">Top Category: {z.top_affected_category}</span>
                      <span className="text-rose-600 font-bold block">Demand: +{z.demand_change_pct}%</span>
                      <span className="text-slate-700 font-bold block">Risk Score: {z.risk_score}/100</span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Cluster Severity Key
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
              <span className="text-slate-700">Normal (0–30)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500" />
              <span className="text-slate-700">Watch (31–60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600" />
              <span className="text-slate-700">Alert (61–80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 border border-rose-700" />
              <span className="text-slate-700 font-bold">High Signal (81–100)</span>
            </div>
          </div>
        </div>

        {/* Selected Zone Detail Panel */}
        <div className="space-y-4">
          {selectedZone ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-5 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Municipal Health Zone
                  </span>
                  <RiskBadge status={selectedZone.status} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {selectedZone.zone}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedZone.area_name}</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pharmacies Monitored</span>
                  </div>
                  <strong className="text-lg font-black text-slate-900">{selectedZone.pharmacies_count}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Active Signals</span>
                  </div>
                  <strong className="text-lg font-black text-slate-900">{selectedZone.active_signals_count}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Top Category</span>
                  </div>
                  <strong className="text-sm font-extrabold text-teal-700 truncate block">
                    {selectedZone.top_affected_category}
                  </strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                    <span>Demand Change</span>
                  </div>
                  <strong className="text-lg font-black text-rose-600">
                    +{selectedZone.demand_change_pct}%
                  </strong>
                </div>
              </div>

              {/* Risk Score Highlight */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Zone Risk Score</span>
                  <span className="text-xs font-bold text-slate-800">{selectedZone.status} Level</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{selectedZone.risk_score}</span>
                  <span className="text-xs text-slate-400"> / 100</span>
                </div>
              </div>

              {/* Action Button */}
              {selectedZone.latest_signal_id && onSelectZoneSignal && (
                <button
                  onClick={() => onSelectZoneSignal(selectedZone.latest_signal_id!)}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  <span>Inspect Explainable AI for {selectedZone.zone}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              Click any zone cluster marker on the map to inspect surveillance metrics.
            </div>
          )}

          {/* All Zones List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              All Chennai Municipal Zones
            </h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {zones.map((z) => (
                <button
                  key={z.zone}
                  onClick={() => {
                    setSelectedZone(z);
                    setMapCenter([z.latitude, z.longitude]);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    selectedZone?.zone === z.zone
                      ? 'bg-teal-50/70 border-teal-300 ring-1 ring-teal-400'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                  }`}
                >
                  <div>
                    <strong className="text-slate-900 font-bold block">{z.zone}</strong>
                    <span className="text-[11px] text-slate-500">{z.area_name}</span>
                  </div>
                  <RiskBadge status={z.status} size="sm" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
