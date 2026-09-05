import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white/95 backdrop-blur-2xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
      isSuccess
        ? 'border-emerald-300 shadow-emerald-900/10 text-slate-800'
        : isError
        ? 'border-rose-300 shadow-rose-900/10 text-slate-800'
        : 'border-blue-300 shadow-blue-900/10 text-slate-800'
    }`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
        isSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : isError ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
      }`}>
        {isSuccess && <CheckCircle2 className="w-4 h-4" />}
        {isError && <AlertCircle className="w-4 h-4" />}
        {!isSuccess && !isError && <Info className="w-4 h-4" />}
      </div>
      
      <p className="text-xs font-semibold text-slate-800 tracking-wide pr-2">{toast.message}</p>
    </div>
  );
}
