import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, CreditCard, ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [crossSell, setCrossSell] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-800 font-semibold">Product not found</p>
        <Link to="/products" className="text-xs text-blue-600 hover:underline">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    openPaymentModal({
      order: {
        id: `ord_${Date.now()}`,
        total_amount: product.price,
        product_name: product.name
      },
      onSuccess: () => {
        showToast(`Payment successful for ${product.name}!`, 'success');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Products
      </Link>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Product Image with Hover Zoom */}
        <div className="rounded-3xl overflow-hidden card-premium border border-slate-200 aspect-video lg:aspect-square relative group shadow-sm">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none opacity-30 group-hover:opacity-10 transition-opacity" />
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 text-blue-700 backdrop-blur-xl border border-slate-200 shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating} ({product.reviews_count} verified reviews)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" />
                In Stock ({product.stock} available)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing Block */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 shadow-inner">
            <span className="text-[10px] text-blue-700 uppercase tracking-widest font-bold">Special Verified Price</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <span className="text-base text-slate-400 line-through font-mono">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
              {product.original_price && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Inclusive of all taxes & GST input credits. Margin-safe settlement active.</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Buy Now with Razorpay
            </button>
            <button
              onClick={() => addToCart(product)}
              className="py-4 px-6 rounded-2xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>

          {/* Trust Value Props */}
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-600 border-t border-slate-200">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Free Metro Express Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <RefreshCw className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>15-Day Instant Replacement</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>GST Tax Invoice Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technical Specifications</h2>
            <span className="text-[10px] text-slate-500 font-mono">({Object.keys(product.specs).length} verified attributes)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center py-2.5 px-3 rounded-lg border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-slate-900 font-mono font-medium">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complementary Cross-Sell Recommendations */}
      {crossSell.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Frequently Bought Together
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {crossSell.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.name}</h5>
                    <p className="text-xs font-bold text-blue-600 font-mono">₹{Number(item.price).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
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
