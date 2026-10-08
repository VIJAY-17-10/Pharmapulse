import React from 'react';
import {
  LayoutDashboard,
  BellRing,
  TableProperties,
  Cpu,
  MapPinned,
  Boxes,
  FileText,
  Settings,
  Brain,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  unreviewedSignalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  unreviewedSignalsCount = 0,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'signals',
      label: 'Signals',
      icon: BellRing,
      badge: unreviewedSignalsCount > 0 ? unreviewedSignalsCount : undefined,
    },
    { id: 'explainable-ai', label: 'Explainable AI', icon: Brain, highlight: true },
    { id: 'pharmacy-data', label: 'Pharmacy Data', icon: TableProperties },
    { id: 'analytics', label: 'AI Analytics', icon: Cpu },
    { id: 'map', label: 'Map', icon: MapPinned },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
            <span className="text-sm font-bold text-slate-800">Navigation Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
              Surveillance Suite
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : item.highlight
                      ? 'text-teal-700 hover:bg-teal-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : item.highlight ? 'text-teal-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart India Hackathon</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Early-warning decision support prototype for public health authorities.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
