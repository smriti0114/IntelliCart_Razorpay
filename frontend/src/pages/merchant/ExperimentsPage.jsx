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
        <div className="h-48 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <FlaskConical className="w-3 h-3 text-violet-600" /> A/B Testing Lab
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" /> Statistical Significance 99.2%
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <FlaskConical className="w-6 h-6 text-violet-600" />
          A/B Growth Experimentation Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Automated multi-variant testing measuring statistical conversion, AOV, and margin preservation
        </p>
      </div>

      {experiments.map((exp) => (
        <div
          key={exp.id}
          className="p-6 rounded-3xl card-premium border border-slate-200 space-y-6 shadow-sm relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{exp.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {exp.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{exp.description}</p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold w-fit shadow-sm">
              <Trophy className="w-4 h-4 text-amber-600 animate-bounce" />
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
                      ? 'bg-blue-50/50 border-2 border-blue-500 shadow-md ring-1 ring-blue-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                        Strategy {key}
                      </span>
                      {isWinner && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-900 flex items-center gap-1 shadow-sm">
                          <Trophy className="w-3 h-3 fill-slate-900" /> WINNER
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{v.name}</h4>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-200/80 text-xs relative">
                    <div className="flex justify-between text-slate-500">
                      <span>Impressions</span>
                      <span className="text-slate-900 font-mono font-medium">{v.impressions}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Conversions</span>
                      <span className="text-slate-900 font-mono font-medium">{v.conversions}</span>
                    </div>

                    {/* Conversion Rate with Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-500">
                        <span>Conversion Rate</span>
                        <span className="text-sm font-black text-emerald-600 font-mono">{v.conversionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isWinner
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(v.conversionRate * 8, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-500 pt-1">
                      <span>Revenue Generated</span>
                      <span className="font-bold text-slate-900 font-mono">₹{Number(v.revenue).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>AOV</span>
                      <span className="font-semibold text-violet-600 font-mono">₹{Number(v.aov).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Growth Agent Diagnostic Insight */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 shadow-sm">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">Growth Agent Analytical Verdict: </span>
              <span>
                Strategy C (Personalized Accessory Recommendations) outperformed Strategy A (10% Flat Discount) by <strong className="text-emerald-700 font-semibold">+10.4% higher conversion</strong> while preserving an additional <strong className="text-slate-900 font-semibold">₹1.4 Lakhs in discount budget</strong>.
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
