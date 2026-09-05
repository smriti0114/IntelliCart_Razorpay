import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartSubtotal, discountAmount, cartTotal, activeCoupon, clearCart, openPaymentModal, showToast, user } = useApp();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || 'Rohan Sharma',
    phone: '+91 9876543210',
    addressLine: 'Flat 402, HighTech Residency, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038'
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">No Items to Checkout</h2>
        <Link to="/products" className="text-xs text-indigo-400 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setIsPlacingOrder(true);

    try {
      // 1. Create order in backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 'cust_0001',
          items: cart.map((i) => ({ product_id: i.id, price: i.price, quantity: i.quantity })),
          shipping_address: shippingAddress,
          applied_coupon: activeCoupon?.code || null,
          discount_amount: discountAmount
        })
      });

      const data = await res.json();
      setIsPlacingOrder(false);

      if (data.success && data.order) {
        // 2. Open Razorpay payment modal
        openPaymentModal({
          order: data.order,
          onSuccess: (paymentResult) => {
            clearCart();
            showToast('Order confirmed and paid! Redirecting to Orders...', 'success');
            navigate('/orders');
          },
          onFailure: (errData) => {
            showToast('Payment failed. AI Recovery protocol has recorded this order.', 'error');
          }
        });
      } else {
        showToast(data.error || 'Failed to initialize order', 'error');
      }
    } catch (err) {
      setIsPlacingOrder(false);
      showToast('Order creation failed', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Cart
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" /> 256-Bit Encrypted Gateway
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Razorpay Test Rail
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Express Checkout</h1>
        <p className="text-xs text-slate-400 mt-0.5">Enter delivery destination and complete instant settlement via Razorpay modal</p>
      </div>

      <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Shipping Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">Physical delivery address across India</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Phone Number (UPI/SMS Alerts)</label>
              <input
                type="text"
                required
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1.5 font-medium">Delivery Address</label>
              <input
                type="text"
                required
                value={shippingAddress.addressLine}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">City</label>
              <input
                type="text"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Pincode</label>
              <input
                type="text"
                required
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Order Summary & Payment Button */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">Razorpay Test Mode</p>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-800/60">
                <span className="text-slate-300 truncate pr-2">
                  {item.name} <span className="text-slate-500">×{item.quantity}</span>
                </span>
                <span className="text-white font-mono font-medium shrink-0">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-slate-800/80">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span>AI Incentive Discount</span>
                <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">FREE (Express)</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-white pt-2 border-t border-slate-800/80">
              <span>Total Payable</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPlacingOrder}
            className="w-full py-4 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Lock className="w-3.5 h-3.5" />
            {isPlacingOrder ? 'Connecting Gateway...' : `Pay ₹${cartTotal.toLocaleString('en-IN')} with Razorpay`}
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Razorpay Secure Test Checkout</span>
          </p>
        </div>
      </form>
    </div>
  );
}
