import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, Shield, TrendingUp, CreditCard, Sparkles, 
  ShoppingBag, Award, CheckCircle2, ArrowRight, ShieldCheck, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, openAuthModal, logout, showToast } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers/cust_0001')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-3">Fetching Customer 360 RFM profile...</p>
      </div>
    );
  }

  const p = profile || {
    name: user?.name || 'Rohan Sharma',
    email: user?.email || 'customer@shoppilot.ai',
    segment: 'High-Value',
    rfm_recency: 4,
    rfm_frequency: 8,
    rfm_monetary: 489000,
    aov: 61125,
    clv: 780000,
    discount_sensitivity: 'Low',
    preferred_category: 'Laptops',
    preferred_payment_method: 'UPI'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-600/30">
            {p.name ? p.name[0] : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{p.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                {p.segment} Tier
              </span>
            </div>
            <p className="text-xs text-slate-400">{p.email}</p>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verified Razorpay Checkout Profile
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-center relative">
          <button
            onClick={openAuthModal}
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/60 transition-all cursor-pointer shadow"
          >
            Switch Profile
          </button>
          {user && (
            <button
              onClick={() => {
                logout();
                showToast('Signed out of profile', 'info');
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all cursor-pointer shadow"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Customer 360 RFM Intelligence Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI Customer Intelligence & RFM Segmentation
          </h3>
          <span className="text-[11px] text-slate-400">Scored via Random Forest Classifier</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Recency Score</span>
            <span className="text-2xl font-black text-white font-mono block">{p.rfm_recency} Days</span>
            <p className="text-[10px] text-emerald-400 font-semibold">Active & engaged buyer</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Order Frequency</span>
            <span className="text-2xl font-black text-indigo-400 font-mono block">{p.rfm_frequency} Orders</span>
            <p className="text-[10px] text-slate-400">High retention affinity</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Lifetime Spend</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block">
              ₹{Number(p.rfm_monetary).toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400">Total settled volume</p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 shadow-lg">
            <span className="text-[11px] text-slate-400 block font-medium">Average Basket (AOV)</span>
            <span className="text-2xl font-black text-purple-400 font-mono block">
              ₹{Number(p.aov).toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-slate-400">Enterprise grade basket</p>
          </div>
        </div>
      </div>

      {/* Behavioral Affinity & Pricing Sensitivity */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Autonomous Pricing Policy Parameters
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 block font-medium">Discount Sensitivity</span>
            <span className="text-base font-black text-emerald-400">{p.discount_sensitivity}</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              High purchase probability (&gt;80%). Margin guardrails prevent unnecessary discount dilution.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 block font-medium">Preferred Catalog Category</span>
            <span className="text-base font-black text-indigo-400">{p.preferred_category}</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Receives weighted relevance boost during AI conversational shopper sessions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-slate-400 block font-medium">Primary Settlement Rail</span>
            <span className="text-base font-black text-blue-400">{p.preferred_payment_method} (Razorpay)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Targeted priority rail for 1-click fallback during payment self-healing protocols.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            PCI-DSS Level 1 Encrypted & RBI Compliant Session
          </span>
          <Link
            to="/orders"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View Full Orders Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
