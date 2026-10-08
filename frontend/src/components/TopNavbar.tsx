import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Layers,
} from 'lucide-react';
import { User } from '../types';
import { NotificationPanel } from './NotificationPanel';
import { NotificationItem } from '../types';

interface TopNavbarProps {
  user: User | null;
  notifications: NotificationItem[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onTriggerDemo: () => void;
  onMarkNotificationRead: (id: number) => void;
  onMarkAllNotificationsRead: () => void;
  onToggleSidebar?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  notifications,
  activeTab,
  onSelectTab,
  onLogout,
  onTriggerDemo,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Health Officer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pharmacy':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Analyst':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-900">
                    Pharma<span className="text-teal-600">Pulse</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.2 rounded">
                    SIH
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
                  AI Pharmacy Spike Tracker
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'signals', label: 'Signals' },
              { id: 'pharmacy-data', label: 'Pharmacy Data' },
              { id: 'analytics', label: 'AI Analytics' },
              { id: 'map', label: 'Map' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'reports', label: 'Reports' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Trigger Demo Scenario Button */}
            <button
              onClick={onTriggerDemo}
              title="Trigger Controlled Scenario: Respiratory Spike in Zone 4"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo Scenario</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <NotificationPanel
                notifications={notifications}
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                onMarkRead={onMarkNotificationRead}
                onMarkAllRead={onMarkAllNotificationsRead}
                onSelectNotification={(n) => {
                  setShowNotifications(false);
                  onSelectTab('signals');
                }}
              />
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                  {user?.full_name ? user.full_name[0] : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-slate-800 leading-none">
                    {user?.full_name?.split(' ')[0] || 'User'}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-medium border rounded px-1 mt-0.5 ${getRoleBadgeColor(
                      user?.role
                    )}`}
                  >
                    {user?.role || 'Analyst'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user?.full_name || 'Demo User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <span
                      className={`inline-block text-[10px] font-semibold border rounded px-1.5 py-0.2 mt-1 ${getRoleBadgeColor(
                        user?.role
                      )}`}
                    >
                      Role: {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectTab('settings');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings & Profile</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
