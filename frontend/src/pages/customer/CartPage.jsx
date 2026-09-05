import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, 
  Tag, ShoppingBag, Lock, CheckCircle2, Zap 
} from 'lucide-react';

export default function CartPage() {
  const { 
    cart, removeFromCart, updateQuantity, cartSubtotal, 
    discountAmount, cartTotal, activeCoupon, applyCoupon, showToast 
  } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [isCheckingOffer, setIsCheckingOffer] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;
    const code = couponInput.toUpperCase().trim();
    if (code === 'SMART5') {
      applyCoupon('SMART5', 5);
      showToast('Applied 5% margin-safe discount!', 'success');
    } else if (code === 'CONVERT10') {
      applyCoupon('CONVERT10', 10);
      showToast('Applied 10% high-intent incentive!', 'success');
    } else {
      showToast('Invalid coupon code. Try SMART5 or ask the AI Shopper.', 'error');
    }
  };

  const handleApplyQuickCoupon = (code, pct) => {
    setCouponInput(code);
    applyCoupon(code, pct);
    showToast(`Applied ${code} (${pct}% off)`, 'success');
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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Discover top-ranked laptops, audio gear, and developer hardware curated by the IntelliCart AI recommendation engine.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Hardware Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Margin Guardrails Active
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" />
            Razorpay Rail Synced
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review selected items, unlock autonomous incentives, and proceed to instant Razorpay settlement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl glass-panel glass-panel-hover border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Link to={`/products/${item.id}`} className="shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-slate-900 border border-slate-700/60 hover:opacity-90 transition-opacity"
                  />
                </Link>
                <div className="min-w-0">
                  <Link to={`/products/${item.id}`} className="block">
                    <h4 className="text-sm font-bold text-white truncate hover:text-indigo-300 transition-colors">
                      {item.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-400">{item.category}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-white font-mono">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500">each</span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 shrink-0 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                <div className="flex items-center gap-2 bg-slate-950/90 rounded-xl p-1.5 border border-slate-800 shadow-inner">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-black text-white font-mono">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-24">
                  <div className="text-sm font-black text-white font-mono">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500">Subtotal</span>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    showToast(`Removed "${item.name}" from cart`, 'info');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <Link
              to="/products"
              className="hover:text-white transition-colors flex items-center gap-1 text-indigo-400"
            >
              <span>+ Add more hardware to cart</span>
            </Link>
            <span>Express Metro Delivery: Free</span>
          </div>
        </div>

        {/* Order Summary & AI Incentives */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</h3>
            <span className="text-[10px] text-slate-400">{cart.length} distinct line items</span>
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
              Our autonomous pricing model calculates basket margin and your purchase probability to unlock targeted incentives.
            </p>
            <button
              onClick={handleAICheckIncentive}
              disabled={isCheckingOffer}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600/40 to-purple-600/40 hover:from-indigo-600/60 hover:to-purple-600/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isCheckingOffer ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-300 border-t-transparent animate-spin" />
                  <span>Analyzing Cart Intent...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Check AI Incentive Eligibility</span>
                </>
              )}
            </button>
          </div>

          {/* Coupon Input & Quick Coupon Chips */}
          <div className="space-y-2">
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
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Quick coupon chips */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Quick:</span>
              <button
                type="button"
                onClick={() => handleApplyQuickCoupon('SMART5', 5)}
                className="px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-bold cursor-pointer transition-colors"
              >
                SMART5 (5%)
              </button>
              <button
                type="button"
                onClick={() => handleApplyQuickCoupon('CONVERT10', 10)}
                className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold cursor-pointer transition-colors"
              >
                CONVERT10 (10%)
              </button>
            </div>
          </div>

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
            className="w-full py-4 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Proceed to Express Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encrypted Razorpay Checkout Protocol</span>
          </p>
        </div>
      </div>
    </div>
  );
}
