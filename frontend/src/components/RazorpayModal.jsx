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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800">
        {/* Razorpay Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base shadow-inner border border-white/30">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-sm">Razorpay Checkout</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-900 uppercase tracking-wider">
                  Test Sandbox
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-mono">Order Ref: #{order.id}</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Payable Settlement</span>
            <span className="text-xs text-slate-700 font-medium">{order.product_name || 'Standard Order'}</span>
          </div>
          <span className="text-2xl font-black text-emerald-600 font-mono">₹{amount.toLocaleString('en-IN')}</span>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {failureState ? (
            /* AI Payment Recovery Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">Initial Payment Attempt Failed</h4>
                    <p className="text-xs mt-1 text-rose-700 font-medium">{failureState.reason}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 text-violet-700">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-violet-900 uppercase tracking-wide">AI Self-Healing Protocol Engaged</h4>
                    <p className="text-xs mt-1 text-blue-800">{failureState.recommended_action}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-[10px] text-violet-700 font-mono">
                  <span>Shopper Intent Score: 94%</span>
                  <span>Margin Discount Erosion: 0%</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleRecoveryRetry}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  Retry with Smart Netbanking Auto-Switch
                </button>
                <button
                  onClick={closePaymentModal}
                  className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Normal Checkout Payment Options */
            <div className="space-y-5">
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  UPI
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Netbanking
                </button>
              </div>

              {/* Method Details */}
              {selectedMethod === 'upi' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Instant UPI Apps</span>
                    <span className="text-emerald-600 font-semibold">Fast Settlement</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <div
                        key={app}
                        className="p-2.5 rounded-xl bg-white text-center border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm"
                      >
                        {app}
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    defaultValue="customer@okaxis"
                    placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                  />
                </div>
              )}

              {selectedMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <label className="text-slate-600 block mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">CVV</label>
                      <input
                        type="password"
                        defaultValue="999"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <p className="text-slate-600 mb-2 font-medium">Select Instant Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, i) => (
                      <div
                        key={bank}
                        className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                          i === 0 ? 'bg-blue-50 border-blue-400 text-violet-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
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
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Complete Payment (Simulate Success)
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Simulate Bank Timeout (Test AI Recovery Loop)
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted SSL • Razorpay Sandbox Test Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
