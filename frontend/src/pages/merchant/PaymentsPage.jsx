import React, { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, AlertTriangle, RefreshCw, Smartphone, Building2 } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          Financial Payments & Razorpay Settlement Ledger
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed gateway audit trail across captured, recovered, and failed payment events
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Payment ID</th>
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Gateway Ref (Razorpay)</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Payment Rail</th>
                <th className="pb-3 font-semibold">Settlement Status</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => {
                const isSuccess = p.status === 'captured' || p.status === 'success';
                const isRecovered = p.status === 'recovered';
                const isFailed = p.status === 'failed';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono text-white font-medium">{p.payment_id || p.id}</td>
                    <td className="py-3 text-slate-400">{p.order_id}</td>
                    <td className="py-3 font-mono text-indigo-300 text-[11px]">
                      {p.razorpay_payment_id || 'rzp_test_sig'}
                    </td>
                    <td className="py-3 font-bold text-white">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono">
                        {p.payment_method || 'UPI'}
                      </span>
                    </td>
                    <td className="py-3">
                      {isSuccess && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Captured
                        </span>
                      )}
                      {isRecovered && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          Recovered
                        </span>
                      )}
                      {isFailed && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-400 text-[11px]">
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
