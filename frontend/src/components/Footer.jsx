import React from 'react';
import { Sparkles, Shield, Cpu, Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>IntelliCart AI</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-xs">
            Autonomous Commerce Growth Engine with transparent reasoning, multi-dimensional product fit scoring, and self-healing Razorpay recovery.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Agentic Capabilities</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="hover:text-blue-600 transition-colors">Intent & Hardware Specs Parsing</li>
            <li className="hover:text-blue-600 transition-colors">5-Dimension Multi-Fit Scoring</li>
            <li className="hover:text-blue-600 transition-colors">Margin-Safe AI Dynamic Incentives</li>
            <li className="hover:text-blue-600 transition-colors">Self-Healing Payment Recovery</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Merchant Engine</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="hover:text-blue-600 transition-colors">Autonomous Growth Opportunity Hub</li>
            <li className="hover:text-blue-600 transition-colors">Revenue & Price Elasticity Simulator</li>
            <li className="hover:text-blue-600 transition-colors">K-Means Customer Segmentation</li>
            <li className="hover:text-blue-600 transition-colors">A/B Testing Multi-Variant Lab</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Telemetry Health</h4>
          <div className="space-y-2.5 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Node.js API Engine Active (Port 5001)</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-200">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>FastAPI ML Intelligence Service</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-700 bg-cyan-50 px-2.5 py-1.5 rounded-xl border border-cyan-200">
              <Shield className="w-3.5 h-3.5 text-cyan-600" />
              <span>Razorpay Sandbox Integration Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <p className="text-slate-500">© 2026 IntelliCart AI. Enterprise Autonomous Commerce Platform.</p>
        <p className="text-slate-500 flex items-center gap-1.5">
          <span>Powered by React 19, Tailwind CSS, Node.js, Scikit-Learn & Razorpay</span>
        </p>
      </div>
    </footer>
  );
}
