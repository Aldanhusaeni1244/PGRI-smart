import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200 transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-700/80'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 text-white border-amber-700/80'
              : 'bg-slate-900/95 text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-medium leading-relaxed">{toast.text}</div>
        </div>
      ))}
    </div>
  );
};
