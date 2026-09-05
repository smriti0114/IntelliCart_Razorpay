import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User, Sparkles, Store, TrendingUp, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('customer@shoppilot.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('customer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        navigate(res.user.role === 'merchant' ? '/merchant/dashboard' : '/');
      }
    } else {
      const res = await register(name, email, password, accountType);
      setLoading(false);
      if (res.success) {
        navigate(res.user.role === 'merchant' ? '/merchant/dashboard' : '/');
      }
    }
  };

  const handleQuickDemoLogin = async (demoEmail, targetRole) => {
    setLoading(true);
    setEmail(demoEmail);
    setPassword('password123');
    const res = await login(demoEmail, 'password123');
    setLoading(false);
    if (res.success) {
      navigate(targetRole === 'merchant' ? '/merchant/dashboard' : '/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Storefront
        </Link>

        <div className="rounded-3xl glass-panel-elevated border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden bg-[#090D18]/95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">IntelliCart AI Access</h1>
              <p className="text-xs text-slate-400">Sign in to Storefront or Merchant Engine</p>
            </div>
          </div>

          {/* Quick Demo Accounts */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              <span>Instant 1-Click Demo Logins</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer@shoppilot.ai', 'customer')}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/50 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Store className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rohan Sharma</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">customer@shoppilot.ai</p>
                <span className="text-[9px] font-semibold text-indigo-400 block mt-1">Customer Persona</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('merchant@shoppilot.ai', 'merchant')}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-purple-500/50 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  <span>Aarav Patel</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">merchant@shoppilot.ai</p>
                <span className="text-[9px] font-semibold text-purple-400 block mt-1">Merchant Persona</span>
              </button>
            </div>
          </div>

          {/* Tab buttons */}
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

          {/* Form */}
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
                <label className="text-xs text-slate-400 font-medium">Account Type</label>
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
                    Customer
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
                    Merchant
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
                  <span>{tab === 'login' ? 'Sign In to IntelliCart' : 'Register Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              JWT + Bcrypt Auth
            </span>
            <span className="text-slate-400">Node & SQLite Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

