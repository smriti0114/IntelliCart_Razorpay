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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Financial Payments & Razorpay Settlement Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed gateway audit trail across captured, recovered, and failed payment events
        </p>
      </div>

      <div className="p-6 rounded-3xl card-premium border border-slate-200 space-y-4 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px]">
                <th className="py-3 px-4 font-semibold">Payment ID</th>
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Gateway Ref (Razorpay)</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Payment Rail</th>
                <th className="py-3 px-4 font-semibold">Settlement Status</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Loading payments audit trail...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const isSuccess = p.status === 'captured' || p.status === 'success';
                  const isRecovered = p.status === 'recovered';
                  const isFailed = p.status === 'failed';

                  return (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-900 font-medium">{p.payment_id || p.id}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{p.order_id}</td>
                      <td className="py-3 px-4 font-mono text-blue-700 text-[11px]">
                        {p.razorpay_payment_id || 'rzp_test_sig'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono border border-slate-200">
                          {p.payment_method || 'UPI'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isSuccess && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Captured
                          </span>
                        )}
                        {isRecovered && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                            Recovered
                          </span>
                        )}
                        {isFailed && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
