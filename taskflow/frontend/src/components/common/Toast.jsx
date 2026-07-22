import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 glass-panel px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 animate-bounce-short">
      {icons[type]}
      <p className="text-xs font-semibold text-slate-200">{message}</p>
      <button onClick={onClose} className="text-slate-500 hover:text-slate-300 p-1">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
