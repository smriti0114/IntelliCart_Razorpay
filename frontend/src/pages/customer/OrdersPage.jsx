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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Package className="w-3 h-3 text-blue-600" /> Fulfillment Ledger
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" /> Auto-Recovery Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order History & Telemetry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time fulfillment and settlement ledger with automated payment recovery status
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-semibold shadow-sm w-fit cursor-pointer"
          title="Refresh orders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Orders</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-500">Place an order via the AI Shopper or Catalog to view live tracking.</p>
          <Link
            to="/ai-shopping"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:scale-105 transition-all cursor-pointer"
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
                className="p-5 rounded-3xl card-premium border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-black text-slate-900 font-mono">#{order.id}</span>
                    {isPaid && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid & Settled
                      </span>
                    )}
                    {isRecovered && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> AI Recovered (Self-Healing)
                      </span>
                    )}
                    {isFailed && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Payment Failed
                      </span>
                    )}
                    {!isPaid && !isRecovered && !isFailed && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {order.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block font-medium">Total Amount</span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {isFailed && (
                    <button
                      onClick={() => handleRetryFailedPayment(order)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      AI Retry Prompt
                    </button>
                  )}

                  <Link
                    to={`/orders/${order.id}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 cursor-pointer"
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
