import React from 'react';
import { Bell, Check, ExternalLink, ShieldAlert, Sparkles, Package } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onSelectNotification?: (notif: NotificationItem) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'HIGH_SIGNAL':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'SUPPLY_PRESSURE':
        return <Package className="w-4 h-4 text-amber-500" />;
      case 'ANOMALY':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Surveillance Alerts</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] text-teal-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No active alerts</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.is_read) onMarkRead(n.id);
                if (onSelectNotification) onSelectNotification(n);
              }}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                !n.is_read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-slate-100 mt-0.5">{getIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-semibold text-slate-900 truncate">{n.title}</h5>
                    {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />}
                  </div>
                  <p className="text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {n.zone}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
