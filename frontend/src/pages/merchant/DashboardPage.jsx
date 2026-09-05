import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, ShoppingCart, DollarSign, ShieldCheck, AlertTriangle, 
  Sparkles, RefreshCw, ArrowUpRight, Activity, Layers, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Custom Tooltip for Recharts in Light Theme
function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs space-y-1">
        <p className="text-slate-500 font-medium">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-slate-600">Revenue:</span>
          <span className="font-bold text-slate-900 font-mono">
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
            <div key={n} className="h-28 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
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
      subColor: 'text-emerald-700',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      glow: 'hover:border-emerald-300'
    },
    {
      title: 'Total Settled Orders',
      val: kpis.totalOrders.toLocaleString('en-IN'),
      sub: `Avg AOV: ₹${kpis.aov.toLocaleString('en-IN')}`,
      subColor: 'text-slate-500',
      icon: ShoppingCart,
      iconColor: 'text-blue-600',
      glow: 'hover:border-blue-300'
    },
    {
      title: 'Overall Conversion Rate',
      val: `${kpis.conversionRate}%`,
      sub: '+3.1% via AI Shopper',
      subColor: 'text-cyan-700',
      icon: TrendingUp,
      iconColor: 'text-cyan-600',
      glow: 'hover:border-cyan-300'
    },
    {
      title: 'AI Recovered Revenue',
      val: `₹${(kpis.recoveredRevenue / 100000).toFixed(1)}L`,
      sub: 'Autonomous retry protocols',
      subColor: 'text-teal-700',
      icon: ShieldCheck,
      iconColor: 'text-teal-600',
      glow: 'hover:border-teal-300'
    },
    {
      title: 'AI Direct Revenue Impact',
      val: `₹${(kpis.aiRevenueImpact / 100000).toFixed(1)}L`,
      sub: 'Margin-safe dynamic pricing',
      subColor: 'text-blue-700',
      icon: Sparkles,
      iconColor: 'text-blue-600',
      glow: 'hover:border-blue-300'
    },
    {
      title: 'Payment Gateway Health',
      val: `${kpis.paymentSuccessRate}%`,
      sub: 'Razorpay UPI & Cards',
      subColor: 'text-blue-700',
      icon: CheckCircle2,
      iconColor: 'text-blue-600',
      glow: 'hover:border-blue-300'
    },
    {
      title: 'Failed Payment Volume',
      val: `₹${(kpis.failedPaymentValue / 100000).toFixed(1)}L`,
      sub: 'Engaged by recovery agent',
      subColor: 'text-rose-700',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      glow: 'hover:border-rose-300'
    },
    {
      title: 'Blended Average Order Value',
      val: `₹${kpis.aov.toLocaleString('en-IN')}`,
      sub: 'Across 6 tech categories',
      subColor: 'text-amber-700',
      icon: Layers,
      iconColor: 'text-amber-600',
      glow: 'hover:border-amber-300'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Merchant Operations
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" />
              Live Telemetry Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Executive Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial telemetry, autonomous conversion lift, and payment settlement metrics
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all flex items-center gap-2 w-fit shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* 8 Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpiItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-3xl card-premium border border-slate-200 space-y-2 relative overflow-hidden group shadow-sm ${item.glow}`}
            >
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold text-slate-700 truncate pr-1">{item.title}</span>
                <div className={`p-2 rounded-xl bg-slate-50 border border-slate-200 ${item.iconColor} shrink-0 shadow-sm`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="pt-1">
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                  {item.val}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px]">
                  {item.subColor === 'text-emerald-700' && <ArrowUpRight className="w-3 h-3 text-emerald-600" />}
                  <span className={`${item.subColor} font-medium`}>{item.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>Settled Revenue Time Series</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Daily Volume
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Continuous daily financial settlement across transactions</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              {['7D', '14D', '30D'].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    chartRange === range
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
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
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1D4ED8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Payment Rail Distribution</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Razorpay</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Volume across UPI, Cards & Netbanking</p>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentStats}>
                <XAxis dataKey="payment_method" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    color: '#0F172A',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {paymentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#2563EB', '#06b6d4', '#60A5FA', '#22d3ee'][index % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Primary Rail: UPI (68%)
            </span>
            <span className="text-emerald-700 font-semibold">94.8% Success</span>
          </div>
        </div>
      </div>

      {/* Live WebSockets Telemetry Stream of AI Decisions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Agent Telemetry Stream (Decision Ledger)
              </h3>
              <p className="text-xs text-slate-500">Autonomous reasoning audits recorded with microsecond timestamps</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 font-semibold w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-radar" />
            <span>Connected via WebSockets (Port 5001)</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px]">
                <th className="py-3 px-4 font-semibold">Decision ID</th>
                <th className="py-3 px-4 font-semibold">Agent & Type</th>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Discount Grant</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Execution Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {allDecisions.map((dec, i) => (
                <tr
                  key={dec.id || i}
                  className={`transition-colors hover:bg-blue-50/40 ${i === 0 ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="py-3 px-4 font-mono text-slate-900 font-semibold flex items-center gap-1.5">
                    {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                    {dec.id}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-blue-700">{dec.decision_type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {dec.customer_id || 'cust_0001'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        dec.discount_percentage > 0
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {dec.discount_percentage > 0 ? `${dec.discount_percentage}% Granted` : '0% (Protected)'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${Math.round(Number(dec.confidence_score || 0.85) * 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-emerald-700 text-[11px]">
                        {Math.round(Number(dec.confidence_score || 0.85) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {dec.status || 'AUTO_EXECUTED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
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
