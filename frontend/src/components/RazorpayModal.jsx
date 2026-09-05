import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  QrCode, 
  Zap, 
  Lock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
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
        confetti({
          particleCount: 90,
          spread: 80,
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
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0A0E1A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Razorpay Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm shadow-inner">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-sm text-white">Razorpay Secure</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/40 tracking-wider font-mono">
                  TEST SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-mono">Order #{order.id}</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Close payment modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount & Security Pill */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Total Amount</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              ₹{amount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {failureState ? (
            /* AI Payment Recovery Screen */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <h4 className="text-sm font-bold text-rose-200">Payment Authorization Failed</h4>
                </div>
                <p className="text-xs text-rose-300/90 leading-relaxed pl-7 font-mono text-[11px]">
                  {failureState.reason}
                </p>
              </div>

              {/* AI Recovery Recommendation HUD */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/50 to-slate-950 border border-indigo-500/40 text-indigo-200 space-y-2.5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      AI Self-Healing Protocol Activated
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    94% Intent
                  </span>
                </div>

                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  {failureState.recommended_action}
                </p>

                <div className="pt-2 border-t border-indigo-500/20 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Purchase Confidence:</span>
                    <span className="font-bold text-emerald-400 font-mono">High Intent (0.94)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Margin Protection:</span>
                    <span className="font-bold text-indigo-300 font-mono">0% Discount Erosion</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleRecoveryRetry}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>Execute Smart Netbanking Auto-Switch</span>
                </button>
                <button
                  onClick={closePaymentModal}
                  className="py-3.5 px-4 rounded-xl font-semibold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Normal Checkout Payment Options */
            <div className="space-y-5">
              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'upi'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'card'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === 'netbanking'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Netbanking</span>
                </button>
              </div>

              {/* UPI Tab */}
              {selectedMethod === 'upi' && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Scan QR or enter VPA</span>
                    <span className="text-indigo-400 font-bold font-mono text-[10px]">Instant Zero-Fee</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-white/5">
                    <div className="w-16 h-16 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                      <QrCode className="w-14 h-14 text-slate-950" />
                    </div>
                    <div className="text-xs space-y-1 min-w-0">
                      <p className="font-bold text-white truncate">Razorpay Dynamic QR</p>
                      <p className="text-[10px] text-slate-400">Scan with GPay, PhonePe, Paytm, or BHIM UPI</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-medium">Or enter UPI ID</label>
                    <input
                      type="text"
                      defaultValue="customer@okaxis"
                      placeholder="e.g. name@okhdfcbank"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {selectedMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-xs">
                  {/* Visual Cardholder Graphic */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 text-white space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
                      <span>TEST VIRTUAL CARD</span>
                      <CreditCard className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div className="font-mono text-sm tracking-widest font-bold">
                      4111 •••• •••• 4444
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                      <span>ROHAN SHARMA</span>
                      <span>12/28</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-medium">CVV</label>
                      <input
                        type="password"
                        defaultValue="999"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {selectedMethod === 'netbanking' && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-xs">
                  <p className="text-slate-400 font-medium">Select Popular Indian Bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank, i) => (
                      <div
                        key={bank}
                        className={`p-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          i === 0 ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200' : 'bg-slate-900/90 border-white/10 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {bank}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Simulation Actions */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handlePaySuccess}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-xl shadow-indigo-900/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Pay ₹{amount.toLocaleString('en-IN')} (Simulate Success)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Simulate Bank Timeout (Trigger AI Recovery)</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL • Official Razorpay Sandbox Test Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

