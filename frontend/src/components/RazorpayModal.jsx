import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, X, CreditCard, Smartphone, Building2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RazorpayModal() {
  const { paymentModal, closePaymentModal, showToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [failureState, setFailureState] = useState(null); // stores failure details if simulated

  if (!paymentModal.isOpen || !paymentModal.order) return null;

  const order = paymentModal.order;
  const amount = Number(order.total_amount || order.amount || 68999);

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          razorpay_order_id: order.razorpay_order_id || `order_${Math.random().toString(36).substring(2, 8)}`,
          razorpay_payment_id: `pay_rzp_${Date.now()}`,
          razorpay_signature: 'sim_valid_signature'
        })
      });
      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast('Payment verified successfully via Razorpay!', 'success');
        if (paymentModal.onSuccess) paymentModal.onSuccess(data);
        closePaymentModal();
      } else {
        showToast(data.error || 'Payment verification failed', 'error');
      }
    } catch (err) {
      setIsProcessing(false);
      showToast('Payment connection error', 'error');
    }
  };

  const handleSimulateFailure = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/simulate-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          outcome: 'FAILED',
          failure_reason: 'UPI Switch Timeout (National Payments Switch Congestion)'
        })
      });
      const data = await res.json();
      setIsProcessing(false);

      setFailureState({
        reason: data.reason,
        recovery_id: data.recovery_id,
        recommended_action: data.recommended_action
      });

      showToast('Payment failed: UPI switch timeout. AI Recovery Agent engaged.', 'error');
      if (paymentModal.onFailure) paymentModal.onFailure(data);
    } catch (err) {
      setIsProcessing(false);
      showToast('Simulation error', 'error');
    }
  };

  const handleRecoveryRetry = async () => {
    if (!failureState?.recovery_id) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/recovery/${failureState.recovery_id}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryMethod: 'Netbanking Auto-Switch' })
      });
      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        showToast('🎉 AI Payment Recovery Succeeded! Order marked as Recovered.', 'success');
        if (paymentModal.onSuccess) paymentModal.onSuccess({ ...data, status: 'recovered' });
        closePaymentModal();
      }
    } catch (err) {
      setIsProcessing(false);
      showToast('Recovery retry failed', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Razorpay Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-wide text-sm">Razorpay Checkout</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  TEST SANDBOX
                </span>
              </div>
              <p className="text-xs text-blue-200">Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="px-6 py-3 bg-slate-800/80 border-b border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Payable</span>
          <span className="text-xl font-bold text-emerald-400">₹{amount.toLocaleString('en-IN')}</span>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {failureState ? (
            /* AI Payment Recovery Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold">Initial Payment Attempt Failed</h4>
                    <p className="text-xs mt-1 text-rose-300/80">{failureState.reason}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">AI Recovery Agent Recommendation</h4>
                    <p className="text-xs mt-1 text-indigo-300">{failureState.recommended_action}</p>
                    <p className="text-[11px] text-indigo-400 mt-2">
                      Intent Score: 94% • High purchase confidence • 0% discount margin erosion required.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleRecoveryRetry}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Retry with Smart Netbanking Auto-Switch
                </button>
                <button
                  onClick={closePaymentModal}
                  className="py-3 px-4 rounded-xl font-medium text-sm bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Normal Checkout Payment Options */
            <div className="space-y-5">
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Netbanking
                </button>
              </div>

              {/* Method Details */}
              {selectedMethod === 'upi' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <p className="text-xs text-slate-400">Popular UPI Apps</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <div
                        key={app}
                        className="p-2.5 rounded-lg bg-slate-800 text-center border border-slate-700/80 text-xs font-medium text-slate-200"
                      >
                        {app}
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    defaultValue="customer@okaxis"
                    placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="999"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                  <p className="text-slate-400 mb-2">Select Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, i) => (
                      <div
                        key={bank}
                        className={`p-2.5 rounded-lg border text-center font-medium cursor-pointer ${
                          i === 0 ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handlePaySuccess}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Complete Payment (Simulate Success)
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Simulate Bank Timeout (Test AI Recovery Loop)
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted SSL • Official Razorpay Sandbox Test Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
