import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Shield, TrendingUp, CreditCard, Sparkles, ShoppingBag } from 'lucide-react';

export default function ProfilePage() {
  const { user, openAuthModal, logout } = useApp();
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
            {p.name ? p.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{p.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {p.segment} Segment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{p.email}</p>
          </div>
        </div>

        {/* Authentication Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={openAuthModal}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer"
          >
            Switch Account
          </button>
          {user && (
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Customer 360 RFM Intelligence Metrics */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          AI Customer Intelligence Metrics (RFM Profile)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Recency</span>
            <span className="text-lg font-bold text-white mt-1 block">{p.rfm_recency} Days</span>
            <span className="text-[10px] text-slate-400">Since last order</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Order Frequency</span>
            <span className="text-lg font-bold text-indigo-400 mt-1 block">{p.rfm_frequency} Orders</span>
            <span className="text-[10px] text-slate-400">Historical conversions</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Spend (Monetary)</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">
              ₹{Number(p.rfm_monetary).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400">Lifetime value</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Average Order Value</span>
            <span className="text-lg font-bold text-purple-400 mt-1 block">
              ₹{Number(p.aov).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400">Basket size</span>
          </div>
        </div>
      </div>

      {/* Behavioral Affinity & Pricing Sensitivity */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Behavioral Affinity & Margin Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Discount Sensitivity</span>
            <span className="text-sm font-bold text-emerald-400">{p.discount_sensitivity}</span>
            <p className="text-[10px] text-slate-400">High intent converts without discounts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Preferred Category</span>
            <span className="text-sm font-bold text-indigo-400">{p.preferred_category}</span>
            <p className="text-[10px] text-slate-400">Receives priority fit weights</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 block">Preferred Payment Rail</span>
            <span className="text-sm font-bold text-blue-400">{p.preferred_payment_method}</span>
            <p className="text-[10px] text-slate-400">Target rail during recovery prompts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
