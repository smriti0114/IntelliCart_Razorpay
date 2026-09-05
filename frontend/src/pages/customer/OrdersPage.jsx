import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openPaymentModal, showToast } = useApp();

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders?limit=30')
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
  }, []);

  const handleRetryFailedPayment = (order) => {
    openPaymentModal({
      order: {
        id: order.id,
        total_amount: order.total_amount
      },
      onSuccess: () => {
        showToast('Payment recovered successfully!', 'success');
        fetchOrders();
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Package className="w-3 h-3 text-indigo-400" /> Fulfillment Ledger
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Auto-Recovery Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order History & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fulfillment and settlement ledger with automated payment recovery status
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md w-fit"
          title="Refresh orders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Orders</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-slate-400">Place an order via the AI Shopper or Catalog to view live tracking.</p>
          <Link
            to="/ai-shopping"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Launch AI Shopper
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPaid = order.status === 'paid';
            const isRecovered = order.status === 'recovered';
            const isFailed = order.status === 'failed';

            return (
              <div
                key={order.id}
                className="p-5 rounded-3xl glass-panel glass-panel-hover border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-white font-mono">#{order.id}</span>
                    {isPaid && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Paid & Settled
                      </span>
                    )}
                    {isRecovered && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5 glow-emerald">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> AI Recovered (Self-Healing)
                      </span>
                    )}
                    {isFailed && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Payment Failed
                      </span>
                    )}
                    {!isPaid && !isRecovered && !isFailed && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {order.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Amount</span>
                    <span className="text-base font-black text-white font-mono">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {isFailed && (
                    <button
                      onClick={() => handleRetryFailedPayment(order)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      AI Retry Prompt
                    </button>
                  )}

                  <Link
                    to={`/orders/${order.id}`}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                    title="View Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
