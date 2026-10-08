import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <AlertTriangle className="w-4 h-4 text-rose-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white',
    warning: 'border-amber-200 bg-white',
    error: 'border-rose-200 bg-white',
    info: 'border-blue-200 bg-white',
  };

  return (
    <div
      className={`pointer-events-auto rounded-xl p-3.5 shadow-xl border flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 ${borderColors[toast.type]}`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <h5 className="text-xs font-bold text-slate-900">{toast.title}</h5>}
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
