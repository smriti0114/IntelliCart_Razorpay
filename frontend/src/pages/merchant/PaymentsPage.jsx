import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, AlertTriangle, RefreshCw, Smartphone, Building2, Search, X, CheckCircle2 } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    fetch('/api/payments?limit=50')
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'captured' && p.status !== 'captured' && p.status !== 'success') return false;
      if (statusFilter === 'recovered' && p.status !== 'recovered') return false;
      if (statusFilter === 'failed' && p.status !== 'failed') return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id?.toLowerCase().includes(q) ||
      p.order_id?.toLowerCase().includes(q) ||
      p.razorpay_payment_id?.toLowerCase().includes(q)
    );
  });

  const capturedTotal = payments
    .filter((p) => p.status === 'captured' || p.status === 'success')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const recoveredTotal = payments
    .filter((p) => p.status === 'recovered')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-indigo-400" /> Gateway Settlement
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Razorpay Test Node 5001 Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Financial Payments & Settlement</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Gateway audit trail across captured, self-healed, and failed payment transactions
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync Gateway</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Total Transactions</span>
          <span className="text-xl font-black text-white font-mono">{payments.length}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Settled Volume</span>
          <span className="text-xl font-black text-emerald-400 font-mono">
            ₹{(capturedTotal / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">AI Recovered Volume</span>
          <span className="text-xl font-black text-teal-400 font-mono">
            ₹{(recoveredTotal / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Gateway Health</span>
          <span className="text-xl font-black text-indigo-400 font-mono">94.8%</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto">
          {['All', 'captured', 'recovered', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'All' ? 'All Rails' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payment ID or rzp ref..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-900/90 border border-slate-700/80 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Settlement Audit Ledger ({filteredPayments.length} records)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Razorpay Test Rail</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Payment ID</th>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Gateway Ref (Razorpay)</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Payment Rail</th>
                <th className="py-3 px-4 font-semibold">Settlement Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
              {filteredPayments.map((p) => {
                const isSuccess = p.status === 'captured' || p.status === 'success';
                const isRecovered = p.status === 'recovered';
                const isFailed = p.status === 'failed';

                return (
                  <tr key={p.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-white font-medium">{p.payment_id || p.id}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{p.order_id}</td>
                    <td className="py-3 px-4 font-mono text-indigo-300 text-[11px]">
                      {p.razorpay_payment_id || 'rzp_test_sig'}
                    </td>
                    <td className="py-3 px-4 font-bold text-white font-mono">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono">
                        {p.payment_method || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {isSuccess && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Captured
                        </span>
                      )}
                      {isRecovered && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 w-fit glow-emerald">
                          <ShieldCheck className="w-3 h-3 text-teal-400" />
                          Recovered
                        </span>
                      )}
                      {isFailed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
