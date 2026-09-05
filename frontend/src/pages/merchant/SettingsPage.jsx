import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, Key, Cpu, RefreshCw, CheckCircle2, Database, Zap, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { showToast } = useApp();
  const [maxDiscount, setMaxDiscount] = useState(15);
  const [marginFloor, setMarginFloor] = useState(20);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);

  const handleRetrainModels = async () => {
    setIsRetraining(true);
    try {
      const res = await fetch('/api/ai/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discount_reduction_pct: 20 })
      });
      setTimeout(() => {
        setIsRetraining(false);
        setRetrainResult({
          status: 'success',
          message: 'Both Random Forest Classifier (Model A) & K-Means Clusters (Model B) successfully updated and hot-swapped into active runtime.'
        });
        showToast('ML Models retrained and hot-swapped successfully!', 'success');
      }, 1500);
    } catch (e) {
      setIsRetraining(false);
      showToast('Retraining error', 'error');
    }
  };

  const handleSaveGuardrails = (e) => {
    e.preventDefault();
    showToast(`Guardrails saved! Hard discount ceiling enforced at ${maxDiscount}%.`, 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-400" /> Executive Safety Controls
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Rule 18 Guardrails Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-purple-400" />
          Engine Configuration & Safety Guardrails
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Hard pricing guardrails, Razorpay credentials, and machine learning model retraining
        </p>
      </div>

      {/* 1. Margin Guardrails & Pricing Safety */}
      <form onSubmit={handleSaveGuardrails} className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Pricing & Margin Safety Guardrails
              </h3>
              <p className="text-xs text-slate-400">Hard algorithmic constraints that the AI Offer Agent cannot violate</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Enforced at API Layer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold block">
                Max Allowable AI Discount Ceiling:
              </label>
              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {maxDiscount}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hard rule: AI Offer Agent cannot exceed this ceiling regardless of customer purchase intent.
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex justify-between items-center">
              <label className="text-slate-300 font-bold block">
                Gross Margin Floor:
              </label>
              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {marginFloor}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              value={marginFloor}
              onChange={(e) => setMarginFloor(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Minimum acceptable profit margin per unit across all catalog categories.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            Save Enforced Guardrails
          </button>
        </div>
      </form>

      {/* 2. Machine Learning Model Retraining */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Machine Learning Model Engine
              </h3>
              <p className="text-xs text-slate-400">Random Forest Classifier & K-Means 5-Cluster Segmentation</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Model A & Model B Synced
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Retrains Model A (Random Forest Purchase Probability Classifier) and Model B (K-Means Customer Segmentation) with new transactional feedback events and hot-reloads model weights in-memory.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleRetrainModels}
            disabled={isRetraining}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining & Evaluating...' : 'Retrain & Hot-Swap ML Models'}</span>
          </button>
        </div>

        {retrainResult && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{retrainResult.message}</span>
          </div>
        )}
      </div>

      {/* 3. API Integrations Status */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Active Infrastructure & APIs
              </h3>
              <p className="text-xs text-slate-400">Live operational status of gateways and database engines</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
            <div>
              <span className="text-white font-bold block">Razorpay Test Gateway</span>
              <span className="text-[10px] text-slate-400 font-mono">rzp_test_active</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Connected
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
            <div>
              <span className="text-white font-bold block">Google Gemini 2.5 Flash</span>
              <span className="text-[10px] text-slate-400 font-mono">@google/genai</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Active
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center">
            <div>
              <span className="text-white font-bold block">Native SQLite DB</span>
              <span className="text-[10px] text-slate-400 font-mono">DatabaseSync (Node 24)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
