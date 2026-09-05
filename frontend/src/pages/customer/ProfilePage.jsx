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
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
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
      <div className="p-6 rounded-3xl card-premium border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-blue-600/20 border border-white">
            {p.name ? p.name[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{p.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {p.segment} Segment
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">{p.email}</p>
          </div>
        </div>

        {/* Authentication Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={openAuthModal}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer shadow-sm"
          >
            Switch Account
          </button>
          {user && (
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 hover:text-rose-800 border border-rose-200 transition-all cursor-pointer shadow-sm"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Customer 360 RFM Intelligence Metrics */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          AI Customer Intelligence Metrics (RFM Profile)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl card-premium border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 block font-medium">Recency</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-1 block">{p.rfm_recency} Days</span>
            <span className="text-[10px] text-slate-400">Since last order</span>
          </div>

          <div className="p-4 rounded-2xl card-premium border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 block font-medium">Order Frequency</span>
            <span className="text-xl font-black text-blue-600 font-mono mt-1 block">{p.rfm_frequency} Orders</span>
            <span className="text-[10px] text-slate-400">Historical conversions</span>
          </div>

          <div className="p-4 rounded-2xl card-premium border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 block font-medium">Total Spend (Monetary)</span>
            <span className="text-xl font-black text-emerald-600 font-mono mt-1 block">
              ₹{Number(p.rfm_monetary).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400">Lifetime value</span>
          </div>

          <div className="p-4 rounded-2xl card-premium border border-slate-200 space-y-1">
            <span className="text-[11px] text-slate-500 block font-medium">Average Order Value</span>
            <span className="text-xl font-black text-cyan-600 font-mono mt-1 block">
              ₹{Number(p.aov).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400">Basket size</span>
          </div>
        </div>
      </div>

      {/* Behavioral Affinity & Pricing Sensitivity */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Behavioral Affinity & Margin Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-slate-500 block">Discount Sensitivity</span>
            <span className="text-sm font-bold text-emerald-600">{p.discount_sensitivity}</span>
            <p className="text-[10px] text-slate-500">High intent converts without discounts</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-slate-500 block">Preferred Category</span>
            <span className="text-sm font-bold text-blue-600">{p.preferred_category}</span>
            <p className="text-[10px] text-slate-500">Receives priority fit weights</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-sm">
            <span className="text-slate-500 block">Preferred Payment Rail</span>
            <span className="text-sm font-bold text-cyan-600">{p.preferred_payment_method}</span>
            <p className="text-[10px] text-slate-500">Target rail during recovery prompts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
