import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Zap, ExternalLink, CheckCircle2, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070E] py-14 text-slate-400 text-xs relative overflow-hidden">
      {/* Soft Ambient Corner Backlights */}
      <div className="absolute top-0 left-1/4 w-96 h-40 bg-indigo-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-purple-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white font-black text-sm tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span>IntelliCart AI</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROD v2.4
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Autonomous AI commerce platform engineered for natural-language hardware discovery, multi-dimensional product fit scoring, margin guardrails, and self-healing payment recovery.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Razorpay Sandbox 256-Bit Encrypted</span>
            </div>
          </div>

          {/* Customer Solutions */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              Storefront Copilot
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/ai-shopping" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  <span>AI Shopping Assistant</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-indigo-400 transition-colors">
                  Hardware & Laptop Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition-colors">
                  Cart & Dynamic Incentives
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-indigo-400 transition-colors">
                  Order Telemetry Ledger
                </Link>
              </li>
            </ul>
          </div>

          {/* Merchant Operations */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              Merchant Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/merchant/dashboard" className="hover:text-purple-400 transition-colors">
                  Executive KPI Console
                </Link>
              </li>
              <li>
                <Link to="/merchant/ai" className="hover:text-purple-400 transition-colors">
                  Autonomous Growth Hub
                </Link>
              </li>
              <li>
                <Link to="/merchant/revenue" className="hover:text-purple-400 transition-colors">
                  Revenue Elasticity Simulator
                </Link>
              </li>
              <li>
                <Link to="/merchant/customers" className="hover:text-purple-400 transition-colors">
                  K-Means Customer Clusters
                </Link>
              </li>
              <li>
                <Link to="/merchant/experiments" className="hover:text-purple-400 transition-colors">
                  A/B Testing Lab (99.2% Sig)
                </Link>
              </li>
            </ul>
          </div>

          {/* Real-time Infrastructure Telemetry */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3.5 font-mono">
              System Telemetry
            </h4>
            <div className="space-y-2.5 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Node.js Engine</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Port 5001
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>WebSockets</span>
                  <span className="font-mono text-slate-400">Socket.io Active</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <span className="text-slate-300 font-medium">FastAPI ML Service</span>
                <span className="text-indigo-400 font-mono font-bold">Port 8000</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <span className="text-slate-300 font-medium">Dual-Mode DB</span>
                <span className="text-teal-400 font-mono font-bold">SQLite / Postgres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-400">
            © 2026 <span className="text-white font-bold">IntelliCart AI</span>. Autonomous Commerce Growth Engine.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 2.5 & Scikit-Learn</span>
            <span>•</span>
            <span>Razorpay Sandbox Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

