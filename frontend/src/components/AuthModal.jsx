import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Sparkles, Store, TrendingUp, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useApp();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('customer@shoppilot.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('customer');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (tab === 'login') {
      await login(email, password);
      setLoading(false);
    } else {
      await register(name, email, password, accountType);
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    await login(demoEmail, 'password123');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-elevated border border-white/15 bg-[#090D18]/95 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">IntelliCart AI Access</h3>
              <p className="text-[11px] text-slate-400">Storefront Shopper or Merchant Engine</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Demo Persona Cards */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            <span>Instant 1-Click Demo Accounts</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer@shoppilot.ai')}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-indigo-300">
                <Store className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rohan Sharma</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">customer@shoppilot.ai</p>
              <span className="text-[9px] font-semibold text-indigo-400 block mt-1">Customer Persona</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('merchant@shoppilot.ai')}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-purple-300">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Aarav Patel</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">merchant@shoppilot.ai</p>
              <span className="text-[9px] font-semibold text-purple-400 block mt-1">Merchant Persona</span>
            </button>
          </div>
        </div>

        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Credential Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Iyer"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-950/80 border border-white/10 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-950/80 border border-white/10 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-400 font-medium">Password</label>
              <span className="text-[10px] text-slate-400 font-mono">Demo: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-950/80 border border-white/10 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="space-y-1 pt-1">
              <label className="text-xs text-slate-400 font-medium">Account Role</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`py-2 px-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    accountType === 'customer'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-950/80 border-white/10 text-slate-400'
                  }`}
                >
                  Customer (Shopper)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('merchant')}
                  className={`py-2 px-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    accountType === 'merchant'
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-slate-950/80 border-white/10 text-slate-400'
                  }`}
                >
                  Merchant (Store Owner)
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In to IntelliCart' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Bcrypt + JWT Secured
          </span>
          <span className="text-slate-400">Node & SQLite Live</span>
        </div>
      </div>
    </div>
  );
}

