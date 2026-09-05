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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> Elasticity Engine
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Regression Model Active</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          AI Revenue & Margin Simulator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Model what-if scenarios: Simulate revenue and gross margin impact based on historical transaction elasticity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sliders Control Panel */}
        <div className="p-6 rounded-3xl card-premium border border-slate-200 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Simulation Parameters</h3>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          </div>

          {/* Slider 1: Discount Reduction */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Suppress Discount Budget</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
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
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Suppresses blanket coupon issuance to high-intent shoppers (Prob &gt; 75%)
            </p>
          </div>

          {/* Slider 2: Average Price Adjustment */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Base Price Adjustment</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded-md border ${
                priceChange >= 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
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
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Simulates price elasticity across catalog demand curves
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Estimates are dynamically computed via regression over 2,100+ database orders and historical price elasticity.
            </p>
          </div>
        </div>

        {/* Projected Simulation Results */}
        <div className="lg:col-span-2 p-6 rounded-3xl card-premium border border-slate-200 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Projected Financial Impact
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculated in real-time based on selected parameters</p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {simulationResult?.simulation?.confidence || 'High Confidence'}
            </span>
          </div>

          {simulationResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-all">
                <span className="text-xs text-slate-500 font-medium">Current 90-Day Baseline</span>
                <p className="text-2xl font-black text-slate-900 font-mono">
                  ₹{Number(simulationResult.baseline.currentRevenue).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  Current discount expense: ₹{Number(simulationResult.baseline.currentDiscountCost).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2 hover:border-blue-300 transition-all">
                <span className="text-xs text-blue-700 font-medium">Discount Budget Savings</span>
                <p className="text-2xl font-black text-blue-600 font-mono">
                  +₹{Number(simulationResult.simulation.discountSavings).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-blue-600 block">Preserved directly in operating budget</span>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-2 hover:border-cyan-300 transition-all">
                <span className="text-xs text-cyan-700 font-medium">Projected Net Revenue Impact</span>
                <p className="text-2xl font-black text-cyan-600 font-mono">
                  {simulationResult.simulation.estimatedRevenueImpact >= 0 ? '+' : ''}
                  ₹{Number(simulationResult.simulation.estimatedRevenueImpact).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-slate-500 block">Reflects slight demand elasticity offset</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2 hover:border-emerald-300 transition-all">
                <span className="text-xs text-emerald-700 font-medium">Net Merchant Margin Expansion</span>
                <p className="text-2xl font-black text-emerald-600 font-mono">
                  +₹{Number(simulationResult.simulation.estimatedMarginImpact).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium block">Direct contribution to bottom-line EBIT</span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
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
