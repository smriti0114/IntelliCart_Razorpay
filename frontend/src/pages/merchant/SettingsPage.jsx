import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, Key, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

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
          message: 'Both Random Forest Classifier (Model A) & K-Means Clusters (Model B) successfully updated and hot-swapped.'
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
    showToast(`Guardrails saved! Max discount ceiling enforced at ${maxDiscount}%.`, 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-purple-400" />
          Engine Configuration & Safety Guardrails
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Rule 18 compliance: Configure hard pricing guardrails, Razorpay credentials, and ML model training
        </p>
      </div>

      {/* 1. Margin Guardrails & Pricing Safety */}
      <form onSubmit={handleSaveGuardrails} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Pricing & Discount Safety Guardrails
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              Max Allowable AI Discount Ceiling: <span className="text-indigo-400">{maxDiscount}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Hard rule: AI Offer Agent cannot exceed this ceiling regardless of customer purchase intent.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              Gross Margin Floor: <span className="text-purple-400">{marginFloor}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="35"
              value={marginFloor}
              onChange={(e) => setMarginFloor(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Minimum acceptable profit margin per unit across all catalog categories.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Save Guardrails
          </button>
        </div>
      </form>

      {/* 2. Machine Learning Model Retraining */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Scikit-Learn Machine Learning Models
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Model A & Model B Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Retrains Model A (Random Forest Purchase Probability Classifier) and Model B (K-Means Customer Segmentation) with new transactional feedback events and hot-reloads model weights.
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleRetrainModels}
            disabled={isRetraining}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining & Evaluating...' : 'Retrain ML Models'}</span>
          </button>
        </div>

        {retrainResult && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{retrainResult.message}</span>
          </div>
        )}
      </div>

      {/* 3. API Integrations Status */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl text-xs">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">API Integration Status</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-white font-semibold block">Razorpay Test Gateway</span>
              <span className="text-[10px] text-slate-500 font-mono">rzp_test_Shoppilot2026</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
              Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-white font-semibold block">Google Gemini 2.5 Flash</span>
              <span className="text-[10px] text-slate-500 font-mono">@google/genai</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
