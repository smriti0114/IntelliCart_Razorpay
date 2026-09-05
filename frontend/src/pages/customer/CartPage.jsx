import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, discountAmount, cartTotal, activeCoupon, applyCoupon, showToast } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [isCheckingOffer, setIsCheckingOffer] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (couponInput.toUpperCase() === 'SMART5') {
      applyCoupon('SMART5', 5);
    } else if (couponInput.toUpperCase() === 'CONVERT10') {
      applyCoupon('CONVERT10', 10);
    } else {
      showToast('Invalid coupon code. Try SMART5 or ask AI Shopper.', 'error');
    }
  };

  const handleAICheckIncentive = async () => {
    setIsCheckingOffer(true);
    try {
      const res = await fetch('/api/ai/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'cust_0001',
          cart_amount: cartSubtotal,
          purchase_probability: 0.65 // moderate probability to trigger targeted incentive
        })
      });
      const data = await res.json();
      setIsCheckingOffer(false);

      if (data.offer?.coupon_code) {
        applyCoupon(data.offer.coupon_code, data.offer.discount_percentage);
        showToast(`AI evaluated your cart: Granted ${data.offer.discount_percentage}% incentive!`, 'success');
      } else {
        showToast(data.offer?.reason || 'No discount necessary for high-intent cart.', 'info');
      }
    } catch (e) {
      setIsCheckingOffer(false);
      showToast('Offer check unavailable', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Discover top-ranked laptops, audio, and gadgets recommended by AI</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Margin Guardrails Active
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Shopping Cart ({cart.length} items)</h1>
        <p className="text-xs text-slate-400 mt-0.5">Review items, unlock autonomous incentives, and proceed to instant Razorpay checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl glass-panel glass-panel-hover border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-18 h-18 rounded-2xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.category}</p>
                  <p className="text-sm font-black text-white font-mono mt-1">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 shrink-0">
                <div className="flex items-center gap-2 bg-slate-950/80 rounded-xl p-1.5 border border-slate-800 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-90"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-black text-white font-mono">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-90"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-24">
                  <div className="text-sm font-black text-white font-mono">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & AI Incentives */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</h3>
            <span className="text-[10px] text-slate-400">{cart.length} unique items</span>
          </div>

          {/* AI Offer Check Banner */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2.5 shadow-lg shadow-indigo-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Dynamic Offer Engine</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Margin Guard Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Our autonomous pricing agent evaluates cart margin and your purchase probability to unlock targeted incentives.
            </p>
            <button
              onClick={handleAICheckIncentive}
              disabled={isCheckingOffer}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600/40 to-purple-600/40 hover:from-indigo-600/60 hover:to-purple-600/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isCheckingOffer ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin" />
                  <span>Analyzing Cart Intent...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Check AI Discount Eligibility</span>
                </>
              )}
            </button>
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter Coupon (e.g. SMART5)"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-950/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 uppercase font-mono tracking-wider transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-md"
            >
              Apply
            </button>
          </form>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-mono font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {activeCoupon && (
              <div className="flex justify-between text-emerald-400 font-semibold p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  AI Incentive Discount ({activeCoupon.code})
                </span>
                <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping & Logistics</span>
              <span className="text-emerald-400 font-semibold">FREE (Express)</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-white pt-3 border-t border-slate-800/80">
              <span className="font-bold">Total Payable</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
