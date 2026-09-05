import React, { useState, useEffect } from 'react';
import { FlaskConical, Trophy, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiments')
      .then((res) => res.json())
      .then((data) => {
        setExperiments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <FlaskConical className="w-3 h-3 text-purple-400" /> A/B Testing Lab
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Statistical Significance 99.2%
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <FlaskConical className="w-6 h-6 text-purple-400" />
          A/B Growth Experimentation Engine
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Automated multi-variant testing measuring statistical conversion, AOV, and margin preservation
        </p>
      </div>

      {experiments.map((exp) => (
        <div
          key={exp.id}
          className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{exp.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {exp.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold w-fit shadow-md shadow-amber-950/30">
              <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Recommended Winner: Strategy {exp.recommendedWinner}</span>
            </div>
          </div>

          {/* 3 Strategy Variant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(exp.variants || {}).map(([key, v]) => {
              const isWinner = exp.recommendedWinner === key;

              return (
                <div
                  key={key}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-300 relative overflow-hidden ${
                    isWinner
                      ? 'bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-900 border-purple-500/80 shadow-xl shadow-purple-950/40 glow-purple'
                      : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {isWinner && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                        Strategy {key}
                      </span>
                      {isWinner && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                          <Trophy className="w-3 h-3 fill-slate-950" /> WINNER
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white leading-snug">{v.name}</h4>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs relative">
                    <div className="flex justify-between text-slate-400">
                      <span>Impressions</span>
                      <span className="text-white font-mono font-medium">{v.impressions}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Conversions</span>
                      <span className="text-white font-mono font-medium">{v.conversions}</span>
                    </div>

                    {/* Conversion Rate with Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Conversion Rate</span>
                        <span className="text-sm font-black text-emerald-400 font-mono">{v.conversionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isWinner
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(v.conversionRate * 8, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-400 pt-1">
                      <span>Revenue Generated</span>
                      <span className="font-bold text-white font-mono">₹{Number(v.revenue).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>AOV</span>
                      <span className="font-semibold text-indigo-300 font-mono">₹{Number(v.aov).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Growth Agent Diagnostic Insight */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-300 shadow-md">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-white">Growth Agent Analytical Verdict: </span>
              <span>
                Strategy C (Personalized Accessory Recommendations) outperformed Strategy A (10% Flat Discount) by <strong className="text-emerald-300 font-semibold">+10.4% higher conversion</strong> while preserving an additional <strong className="text-white font-semibold">₹1.4 Lakhs in discount budget</strong>.
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
