import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  ShieldCheck, RefreshCw, Truck, Check, ExternalLink, Zap 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const { openPaymentModal, showToast } = useApp();

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders?limit=40')
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
        showToast('Payment recovered successfully via AI Self-Healing!', 'success');
        fetchOrders();
      }
    });
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'paid') return o.status === 'paid';
    if (statusFilter === 'recovered') return o.status === 'recovered';
    if (statusFilter === 'failed') return o.status === 'failed';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Package className="w-3 h-3 text-indigo-400" /> Fulfillment Ledger
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Auto-Recovery Protocol Live
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Order History & Tracking</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time fulfillment and settlement ledger with automated payment recovery status
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md w-fit cursor-pointer"
          title="Refresh orders"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync Ledger</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'All', label: 'All Orders', count: orders.length },
          { id: 'paid', label: 'Paid & Settled', count: orders.filter((o) => o.status === 'paid').length },
          { id: 'recovered', label: 'AI Recovered', count: orders.filter((o) => o.status === 'recovered').length },
          { id: 'failed', label: 'Payment Failed', count: orders.filter((o) => o.status === 'failed').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              statusFilter === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'glass-panel text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-950/60 font-mono text-slate-300">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse p-6 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="h-8 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">No Orders Matching Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no orders with status "{statusFilter}". Explore our technology catalog to place a test order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPaid = order.status === 'paid';
            const isRecovered = order.status === 'recovered';
            const isFailed = order.status === 'failed';

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-4 shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
                  <div className="space-y-1">
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
                      <span className="text-[11px] text-slate-400 block font-medium">Settled Amount</span>
                      <span className="text-lg font-black text-white font-mono">
                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {isFailed && (
                      <button
                        onClick={() => handleRetryFailedPayment(order)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        AI Recovery Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Fulfillment Tracker */}
                {(isPaid || isRecovered) && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Order Confirmed
                      </span>
                      <span className="text-indigo-300 font-semibold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-indigo-400" /> Dispatched via BlueDart Express
                      </span>
                      <span className="text-slate-500">Estimated Delivery: In 2 Days</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 h-1.5 rounded-full w-2/3" />
                    </div>
                  </div>
                )}

                {isFailed && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      Payment authorization failed at bank level. The AI Self-Healing agent has prepared a one-click fallback channel.
                    </span>
                    <button
                      onClick={() => handleRetryFailedPayment(order)}
                      className="text-xs font-bold text-white underline hover:no-underline cursor-pointer shrink-0 ml-2"
                    >
                      Retry Gateway Now
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
