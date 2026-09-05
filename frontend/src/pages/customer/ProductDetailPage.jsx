import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, CreditCard, 
  ArrowLeft, Check, Sparkles, Plus, Minus, Lock, CheckCircle2, Zap 
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [crossSell, setCrossSell] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openPaymentModal, showToast } = useApp();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setCrossSell(data.crossSell || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-4">Loading high-performance specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-white font-bold text-lg">Product Not Found</p>
        <p className="text-xs text-slate-400">The product ID might be retired or unavailable in this catalog partition.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    openPaymentModal({
      order: {
        id: `ord_${Date.now()}`,
        total_amount: product.price * quantity,
        product_name: `${product.name} (x${quantity})`
      },
      onSuccess: () => {
        showToast(`Payment successful for ${product.name}!`, 'success');
      }
    });
  };

  const handleAddBundleToCart = (item) => {
    addToCart(item);
    showToast(`Added ${item.name} to cart!`, 'success');
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800 w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Technology Catalog</span>
      </Link>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Product Image Showcase */}
        <div className="rounded-3xl overflow-hidden glass-panel border border-slate-800 aspect-video lg:aspect-square relative group shadow-2xl">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950/85 text-indigo-300 backdrop-blur-xl border border-slate-700/80 shadow-lg">
              {product.category}
            </span>
            {hasDiscount && (
              <span className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-rose-500/90 text-white backdrop-blur-xl shadow-lg">
                -{discountPct}% OFF
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-950/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" />
              Verified Authentic Product
            </span>
          </div>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviews_count || 148} verified buyer reviews)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" />
                In Stock ({product.stock} units available)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing Block */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1.5 shadow-inner">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" /> Guaranteed Direct Price
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-500 line-through font-mono">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-0.5 rounded-md text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Save ₹{Number(product.original_price - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Inclusive of all taxes & Razorpay direct settlement protection</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-300">Quantity:</span>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total: ₹{Number(product.price * quantity).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Instant Buy with Razorpay (₹{Number(product.price * quantity).toLocaleString('en-IN')})
            </button>
            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }
                showToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
              }}
              className="py-3.5 px-6 rounded-xl font-semibold text-xs bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>

          {/* Razorpay Trust Rail Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-xs text-indigo-300">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">Razorpay Verified Partner Merchant</span>
            </div>
            <span className="text-[10px] text-slate-400">128-Bit TLS & Instant UPI Refunds</span>
          </div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Free Metro Express Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
              <span>15-Day Instant Replacement</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Check className="w-4 h-4 text-blue-400 shrink-0" />
              <span>GST Tax Invoice Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Technical Specifications & Architecture
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">({Object.keys(product.specs).length} verified attributes)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-2.5 px-3 rounded-lg border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-white font-mono font-medium">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complementary Cross-Sell Recommendations */}
      {crossSell.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Frequently Bought Together (AI Optimized)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Bundle for complete setup synergy</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {crossSell.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel glass-panel-hover border border-slate-800 flex items-center justify-between gap-3 shadow-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                    <p className="text-xs font-bold text-indigo-400 font-mono">₹{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddBundleToCart(item)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
