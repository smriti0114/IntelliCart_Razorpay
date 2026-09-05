import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, ShoppingCart, DollarSign, ShieldCheck, AlertTriangle, 
  Sparkles, RefreshCw, ArrowUpRight, Activity, Layers, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Custom Glassmorphic Tooltip for Recharts
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <p className="text-slate-400 font-medium">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-slate-200">Revenue:</span>
          <span className="font-bold text-white font-mono">
            ₹{Number(payload[0].value).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const { liveTelemetry } = useApp();
  const [kpis, setKpis] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartRange, setChartRange] = useState('14D');

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics/revenue').then((r) => r.json()),
      fetch('/api/analytics/payments').then((r) => r.json()),
      fetch('/api/audit-logs').then((r) => r.json())
    ])
      .then(([revData, payData, auditData]) => {
        setKpis(revData.kpis);
        setRevenueTrend(revData.revenueTrend || []);
        setPaymentStats(payData.byMethod || []);
        setRecentDecisions(Array.isArray(auditData) ? auditData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !kpis) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Combine live WebSocket telemetry with historical decisions
  const allDecisions = [...liveTelemetry, ...recentDecisions].slice(0, 15);

  const kpiItems = [
    {
      title: 'Gross Settled Revenue',
      val: `₹${(kpis.totalRevenue / 100000).toFixed(1)}L`,
      sub: '+14.2% vs last month',
      subColor: 'text-emerald-400',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      glow: 'hover:border-emerald-500/30'
    },
    {
      title: 'Total Settled Orders',
      val: kpis.totalOrders.toLocaleString('en-IN'),
      sub: `Avg AOV: ₹${kpis.aov.toLocaleString('en-IN')}`,
      subColor: 'text-slate-400',
      icon: ShoppingCart,
      iconColor: 'text-indigo-400',
      glow: 'hover:border-indigo-500/30'
    },
    {
      title: 'Overall Conversion Rate',
      val: `${kpis.conversionRate}%`,
      sub: '+3.1% via AI Shopper',
      subColor: 'text-purple-400',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      glow: 'hover:border-purple-500/30'
    },
    {
      title: 'AI Recovered Revenue',
      val: `₹${(kpis.recoveredRevenue / 100000).toFixed(1)}L`,
      sub: 'Autonomous retry protocols',
      subColor: 'text-teal-400',
      icon: ShieldCheck,
      iconColor: 'text-teal-400',
      glow: 'hover:border-teal-500/30'
    },
    {
      title: 'AI Direct Revenue Impact',
      val: `₹${(kpis.aiRevenueImpact / 100000).toFixed(1)}L`,
      sub: 'Margin-safe dynamic pricing',
      subColor: 'text-indigo-400',
      icon: Sparkles,
      iconColor: 'text-indigo-400',
      glow: 'hover:border-indigo-500/30'
    },
    {
      title: 'Payment Gateway Health',
      val: `${kpis.paymentSuccessRate}%`,
      sub: 'Razorpay UPI & Cards',
      subColor: 'text-blue-400',
      icon: CheckCircle2,
      iconColor: 'text-blue-400',
      glow: 'hover:border-blue-500/30'
    },
    {
      title: 'Failed Payment Volume',
      val: `₹${(kpis.failedPaymentValue / 100000).toFixed(1)}L`,
      sub: 'Engaged by recovery agent',
      subColor: 'text-rose-400',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      glow: 'hover:border-rose-500/30'
    },
    {
      title: 'Blended Average Order Value',
      val: `₹${kpis.aov.toLocaleString('en-IN')}`,
      sub: 'Across 6 tech categories',
      subColor: 'text-amber-400',
      icon: Layers,
      iconColor: 'text-amber-400',
      glow: 'hover:border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Merchant Operations
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" />
              Live Telemetry Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Merchant Executive Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time financial telemetry, autonomous conversion lift, and payment settlement metrics
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 w-fit shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* 8 Executive KPI Cards with Micro-Glow and Glassmorphism */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800 space-y-2 relative overflow-hidden group ${item.glow}`}
            >
              {/* Subtle ambient corner glow */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="font-medium truncate pr-1">{item.title}</span>
                <div className={`p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 ${item.iconColor} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight font-mono">
                  {item.val}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px]">
                  {item.subColor === 'text-emerald-400' && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                  <span className={item.subColor}>{item.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Settled Revenue Time Series</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Daily Volume
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Continuous daily financial settlement across transactions</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
              {['7D', '14D', '30D'].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    chartRange === range
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Bar Chart */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Payment Rail Distribution</span>
              <span className="text-[10px] font-semibold text-emerald-400">Razorpay</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Volume across UPI, Cards & Netbanking</p>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentStats}>
                <XAxis dataKey="payment_method" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d1a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#ec4899', '#06b6d4'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Primary Rail: UPI (68%)
            </span>
            <span className="text-emerald-400 font-semibold">94.8% Success</span>
          </div>
        </div>
      </div>

      {/* Live WebSockets Telemetry Stream of AI Decisions */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Agent Telemetry Stream (Decision Ledger)
              </h3>
              <p className="text-xs text-slate-400">Autonomous reasoning audits recorded with microsecond timestamps</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-radar" />
            <span>Connected via WebSockets (Port 5001)</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Decision ID</th>
                <th className="py-3 px-4 font-semibold">Agent & Type</th>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Discount Grant</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Execution Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
              {allDecisions.map((dec, i) => (
                <tr
                  key={dec.id || i}
                  className={`transition-colors hover:bg-indigo-950/20 ${i === 0 ? 'bg-indigo-500/5' : ''}`}
                >
                  <td className="py-3 px-4 font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                    {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    {dec.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-300">{dec.decision_type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {dec.customer_id || 'cust_0001'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        dec.discount_percentage > 0
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dec.discount_percentage > 0 ? `${dec.discount_percentage}% Granted` : '0% (Protected)'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${Math.round(Number(dec.confidence_score || 0.85) * 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-emerald-400 text-[11px]">
                        {Math.round(Number(dec.confidence_score || 0.85) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {dec.status || 'AUTO_EXECUTED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {dec.created_at ? new Date(dec.created_at).toLocaleTimeString() : 'Just now'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

