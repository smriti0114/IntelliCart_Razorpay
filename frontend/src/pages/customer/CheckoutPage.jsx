import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, 
  MapPin, Phone, User, Building, Sparkles, Zap 
} from 'lucide-react';

const ADDRESS_PRESETS = [
  {
    label: 'Bengaluru Tech Hub',
    fullName: 'Rohan Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, HighTech Residency, 100 Feet Rd, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038'
  },
  {
    label: 'Mumbai BKC Office',
    fullName: 'Rohan Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Suite 12B, Maker Maxity, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051'
  },
  {
    label: 'Delhi NCR Campus',
    fullName: 'Rohan Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Tower 4, DLF Cyber City, Phase II',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002'
  }
];

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
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <CreditCard className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">No Items to Checkout</h2>
        <p className="text-xs text-slate-400">Add products to your cart before proceeding to Razorpay checkout.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800 w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Cart</span>
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Lock className="w-3 h-3 text-indigo-400" /> 256-Bit Encrypted Gateway
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> Razorpay Test Rail Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Express Checkout</h1>
        <p className="text-xs text-slate-400 mt-0.5">Enter delivery destination and complete instant settlement via Razorpay modal</p>
      </div>

      <form onSubmit={handleInitiatePayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Information Form */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Shipping & Delivery Address
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Physical express delivery anywhere across India</p>
            </div>

            {/* Quick preset buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {ADDRESS_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setShippingAddress({
                    fullName: preset.fullName,
                    phone: preset.phone,
                    addressLine: preset.addressLine,
                    city: preset.city,
                    state: preset.state,
                    pincode: preset.pincode
                  })}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Full Recipient Name
              </label>
              <input
                type="text"
                required
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Phone Number (UPI & Delivery SMS)
              </label>
              <input
                type="text"
                required
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono shadow-inner"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-400 block mb-1.5 font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                Street Address, Flat / Floor
              </label>
              <input
                type="text"
                required
                value={shippingAddress.addressLine}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">City</label>
              <input
                type="text"
                required
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Pincode (ZIP)</label>
              <input
                type="text"
                required
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono shadow-inner"
              />
            </div>
          </div>

          <div className="pt-2 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Eligible for Free Priority Metro Dispatch with tracking SMS within 2 hours.</span>
          </div>
        </div>

        {/* Order Summary & Payment Button */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
          <div className="border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Payment Summary</h3>
            <p className="text-xs text-slate-400 mt-0.5">Razorpay Test Gateway (Sandbox Active)</p>
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
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  AI Incentive Discount
                </span>
                <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping & Logistics</span>
              <span className="text-emerald-400 font-semibold">FREE (Priority)</span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-bold text-white pt-2 border-t border-slate-800/80">
              <span>Total Payable</span>
              <span className="text-2xl font-black text-indigo-400 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPlacingOrder}
            className="w-full py-4 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            {isPlacingOrder ? 'Connecting Gateway...' : `Pay ₹${cartTotal.toLocaleString('en-IN')} with Razorpay`}
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Razorpay Secure Test Mode</span>
          </p>
        </div>
      </form>
    </div>
  );
}
