import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 max-w-md bg-[#0C1222]/95 border-white/15 text-white">
      <div className={`p-2 rounded-xl shrink-0 ${
        isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
        isError ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
      }`}>
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
        {!isSuccess && !isError && <Sparkles className="w-4 h-4 text-indigo-400" />}
      </div>
      
      <div className="flex-1 pr-2">
        <p className="text-xs font-semibold text-slate-100 leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}

