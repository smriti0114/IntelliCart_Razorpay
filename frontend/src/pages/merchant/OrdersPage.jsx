import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MerchantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [statusFilter]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-indigo-400" />
            Master Orders Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track order lifecycle, payment settlement state, and AI recovery status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {['All', 'paid', 'recovered', 'failed', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer ID</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Discount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono text-white font-semibold">{o.id}</td>
                  <td className="py-3 text-slate-400">{o.customer_id}</td>
                  <td className="py-3 font-bold text-white">
                    ₹{Number(o.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-emerald-400">
                    {o.discount_amount > 0 ? `-₹${Number(o.discount_amount).toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3">
                    {o.status === 'paid' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Paid
                      </span>
                    )}
                    {o.status === 'recovered' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        AI Recovered
                      </span>
                    )}
                    {o.status === 'failed' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Failed
                      </span>
                    )}
                    {o.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right text-slate-400 text-[11px]">
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
