import React from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>ShopPilot AI</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Autonomous Commerce Growth Engine with transparent reasoning, multi-dimensional product fit scoring, and self-healing payment recovery.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Agentic Capabilities</h4>
          <ul className="space-y-2">
            <li>Intent & Specs Parsing</li>
            <li>Multi-dimensional Fit Scoring</li>
            <li>Margin-Safe AI Dynamic Offers</li>
            <li>Automated Payment Recovery</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Merchant Engine</h4>
          <ul className="space-y-2">
            <li>Autonomous Growth Hub</li>
            <li>Revenue & Elasticity Simulator</li>
            <li>K-Means Customer Segmentation</li>
            <li>A/B Testing Experiments Engine</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">System Telemetry</h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Node.js Engine Active (Port 5001)</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <Zap className="w-3 h-3" />
              <span>FastAPI ML Intelligence Service</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Shield className="w-3 h-3" />
              <span>Razorpay Sandbox Integration</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <p>© 2026 ShopPilot AI. Enterprise Agentic Commerce Platform.</p>
        <p className="text-slate-400">Built with Next/React, Tailwind CSS, Node.js, Scikit-Learn & Razorpay.</p>
      </div>
    </footer>
  );
}
