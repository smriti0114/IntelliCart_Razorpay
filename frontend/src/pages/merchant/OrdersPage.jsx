import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, X, ArrowUpRight } from 'lucide-react';

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    const filterQuery = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
    fetch(`/api/orders${filterQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.id?.toLowerCase().includes(q) || o.customer_id?.toLowerCase().includes(q);
  });

  const paidCount = orders.filter((o) => o.status === 'paid').length;
  const recoveredCount = orders.filter((o) => o.status === 'recovered').length;
  const failedCount = orders.filter((o) => o.status === 'failed').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <ShoppingCart className="w-3 h-3 text-purple-400" /> Settlement Ledger
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> 2,100+ Transactions Indexed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Master Orders Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Audit fulfillment progression, Razorpay payment captures, and AI Self-Healing recovery events
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Total Orders Loaded</span>
          <span className="text-xl font-black text-white font-mono">{orders.length}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Settled Directly</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{paidCount}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">AI Recovered</span>
          <span className="text-xl font-black text-teal-400 font-mono">{recoveredCount}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Payment Failed</span>
          <span className="text-xl font-black text-rose-400 font-mono">{failedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto w-full sm:w-auto">
          {['All', 'paid', 'recovered', 'failed', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'All' ? 'All Orders' : st}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order or Customer ID..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-900/90 border border-slate-700/80 text-white rounded-xl focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
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

      {/* Orders Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Transactional Records ({filteredOrders.length} matching)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Real-time SQLite Sync</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Settlement Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-purple-950/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-white font-semibold">{o.id}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{o.customer_id}</td>
                  <td className="py-3 px-4 font-bold text-white font-mono">
                    ₹{Number(o.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">
                    {o.discount_amount > 0 ? `-₹${Number(o.discount_amount).toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3 px-4">
                    {o.status === 'paid' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Paid
                      </span>
                    )}
                    {o.status === 'recovered' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 w-fit glow-emerald">
                        <ShieldCheck className="w-3 h-3 text-teal-400" />
                        AI Recovered
                      </span>
                    )}
                    {o.status === 'failed' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 w-fit">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        Failed
                      </span>
                    )}
                    {o.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 w-fit">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {new Date(o.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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
