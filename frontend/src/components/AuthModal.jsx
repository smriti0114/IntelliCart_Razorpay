import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Sparkles, Store, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">IntelliCart AI Authentication</h3>
              <p className="text-[11px] text-slate-500">Secure access to Customer Store or Merchant Engine</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Quick Demo Switcher Section */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            <span>Instant Demo Accounts</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" /> 1-Click Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer@shoppilot.ai')}
              className="p-2.5 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Rohan Sharma</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">customer@shoppilot.ai</p>
              <span className="text-[9px] font-semibold text-blue-600 block mt-1">Customer Persona</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('merchant@shoppilot.ai')}
              className="p-2.5 rounded-xl bg-white hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 text-left transition-all group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-cyan-600">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                <span>Aarav Patel</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">merchant@shoppilot.ai</p>
              <span className="text-[9px] font-semibold text-cyan-600 block mt-1">Merchant Persona</span>
            </button>
          </div>
        </div>

        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Credential Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-medium">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Iyer"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-600 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-mono shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-600 font-medium">Password</label>
              <span className="text-[10px] text-slate-500 font-mono">Demo: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition-colors font-mono shadow-inner"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="space-y-1 pt-1">
              <label className="text-xs text-slate-600 font-medium">Account Role</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`py-2 px-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    accountType === 'customer'
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Customer (Shopper)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('merchant')}
                  className={`py-2 px-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                    accountType === 'merchant'
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-700'
                      : 'bg-white border-slate-200 text-slate-600'
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
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Bcrypt + JWT Secured
          </span>
          <span className="text-slate-500">PostgreSQL / SQLite</span>
        </div>
      </div>
    </div>
  );
}
