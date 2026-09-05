import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 bg-slate-900/90 border-slate-700/80 text-white">
      {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
      
      <p className="text-sm font-medium text-slate-200">{toast.message}</p>
    </div>
  );
}
