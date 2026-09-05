import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

export default function RevenueSimulatorPage() {
  const [discountReduction, setDiscountReduction] = useState(20);
  const [priceChange, setPriceChange] = useState(0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const runSimulation = (reduction, priceDelta) => {
    setLoading(true);
    fetch('/api/ai/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discount_reduction_pct: reduction,
        price_change_pct: priceDelta
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setSimulationResult(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    runSimulation(discountReduction, priceChange);
  }, [discountReduction, priceChange]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Elasticity Engine
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Regression Model Active</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          AI Revenue & Margin Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Model what-if scenarios: Simulate revenue and gross margin impact based on historical transaction elasticity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders Control Panel */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulation Parameters</h3>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>

          {/* Slider 1: Discount Reduction */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Suppress Discount Budget</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {discountReduction}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={discountReduction}
              onChange={(e) => setDiscountReduction(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Suppresses blanket coupon issuance to high-intent shoppers (Prob &gt; 75%)
            </p>
          </div>

          {/* Slider 2: Average Price Adjustment */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Base Price Adjustment</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md border ${
                priceChange >= 0
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                {priceChange > 0 ? `+${priceChange}%` : `${priceChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="20"
              step="1"
              value={priceChange}
              onChange={(e) => setPriceChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Simulates price elasticity across catalog demand curves
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300/90 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Estimates are dynamically computed via regression over 2,100+ database orders and historical price elasticity.
            </p>
          </div>
        </div>

        {/* Projected Simulation Results */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Projected Financial Impact
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculated in real-time based on selected parameters</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {simulationResult?.simulation?.confidence || 'High Confidence'}
            </span>
          </div>

          {simulationResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                <span className="text-xs text-slate-400 font-medium">Current 90-Day Baseline</span>
                <p className="text-2xl font-black text-white font-mono">
                  ₹{Number(simulationResult.baseline.currentRevenue).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  Current discount expense: ₹{Number(simulationResult.baseline.currentDiscountCost).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-950/25 border border-indigo-500/35 space-y-2 hover:border-indigo-400/50 transition-all">
                <span className="text-xs text-indigo-300 font-medium">Discount Budget Savings</span>
                <p className="text-2xl font-black text-indigo-300 font-mono">
                  +₹{Number(simulationResult.simulation.discountSavings).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-indigo-400 block">Preserved directly in operating budget</span>
              </div>

              <div className="p-5 rounded-2xl bg-purple-950/25 border border-purple-500/35 space-y-2 hover:border-purple-400/50 transition-all">
                <span className="text-xs text-purple-300 font-medium">Projected Net Revenue Impact</span>
                <p className="text-2xl font-black text-purple-300 font-mono">
                  {simulationResult.simulation.estimatedRevenueImpact >= 0 ? '+' : ''}
                  ₹{Number(simulationResult.simulation.estimatedRevenueImpact).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-400 block">Reflects slight demand elasticity offset</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-2 hover:border-emerald-400/60 transition-all">
                <span className="text-xs text-emerald-300 font-medium">Net Merchant Margin Expansion</span>
                <p className="text-2xl font-black text-emerald-300 font-mono">
                  +₹{Number(simulationResult.simulation.estimatedMarginImpact).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-400 font-medium block">Direct contribution to bottom-line EBIT</span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Compliance & Methodology Disclaimer:
            </span>
            <p className="leading-relaxed">
              {simulationResult?.simulation?.disclaimer ||
                'Clearly labeled as an analytical projection based on historical customer elasticity, not a guaranteed contractual result.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
