import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200/80">
      <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
