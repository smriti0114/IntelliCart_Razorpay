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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            Master Orders Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track order lifecycle, payment settlement state, and AI recovery status
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          {['All', 'paid', 'recovered', 'failed', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl card-premium border border-slate-200 space-y-4 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px]">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Customer ID</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Loading master orders ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-900 font-semibold">{o.id}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{o.customer_id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      ₹{Number(o.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-mono">
                      {o.discount_amount > 0 ? `-₹${Number(o.discount_amount).toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="py-3 px-4">
                      {o.status === 'paid' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Paid
                        </span>
                      )}
                      {o.status === 'recovered' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                          AI Recovered
                        </span>
                      )}
                      {o.status === 'failed' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Failed
                        </span>
                      )}
                      {o.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
