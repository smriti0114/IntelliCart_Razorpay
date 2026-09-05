import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, ArrowRight, Bot, Shield, CheckCircle2, Star, Zap, ShoppingCart,
  Layers, ArrowUpRight, Cpu, Compass
} from 'lucide-react';

export default function HomePage() {
  const [promptInput, setPromptInput] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const suggestedQueries = [
    'I need a laptop for coding and gaming under ₹70,000.',
    'Studio ANC headphones under ₹10,000 for remote calls.',
    'Flagship 5G smartphone under ₹55,000 with best camera.',
    'Ergonomic setup: Laptop stand & GaN fast charger.'
  ];

  useEffect(() => {
    fetch('/api/products?limit=6')
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch featured products error:', err);
        setLoading(false);
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    navigate(`/ai-shopping?q=${encodeURIComponent(promptInput)}`);
  };

  const handleQueryClick = (q) => {
    navigate(`/ai-shopping?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-16 pb-20 bg-grid-pattern relative">
      {/* Hero Section with Ambient Lights */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Soft Radial Backlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide shadow-sm animate-float backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Autonomous Commerce Growth Engine</span>
          </div>

          {/* Shimmering Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] text-slate-900">
            Discover, Compare & Buy with{' '}
            <span className="shimmer-text">
              Agentic Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Not just a generic chatbot. IntelliCart AI actively parses your hardware intent, executes 5-dimension fit scoring, protects merchant margins, and auto-recovers checkout friction.
          </p>

          {/* Interactive Agent Search Box */}
          <div className="max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-3xl blur-md opacity-25 group-hover:opacity-45 transition duration-500" />
              <div className="relative flex items-center bg-white border border-slate-300 rounded-2xl p-2 shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Bot className="w-5 h-5 text-violet-600 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask anything (e.g. 'I need a laptop for coding and gaming under ₹70,000')"
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Ask AI Shopper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Prompt Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-500 text-[11px] font-medium">Try asking:</span>
              {suggestedQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQueryClick(query)}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 transition-all text-[11px] shadow-sm hover:-translate-y-0.5 cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Proof Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="text-center space-y-1 p-2">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹6.3Cr+</p>
            <p className="text-xs text-slate-500 font-medium">Total Settled Revenue</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-200">
            <p className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">97.2%</p>
            <p className="text-xs text-slate-500 font-medium">Recommendation Fit Accuracy</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-200">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">₹50.7L+</p>
            <p className="text-xs text-slate-500 font-medium">Autonomous Recovered Revenue</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-slate-200">
            <p className="text-2xl sm:text-3xl font-black text-cyan-600 tracking-tight">0%</p>
            <p className="text-xs text-slate-500 font-medium">Margin Discount Erosion</p>
          </div>
        </div>
      </section>

      {/* Featured Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trending Hardware & Gadgets</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">High-throughput developer workstations, flagship phones, and accessories</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Explore All 110+ Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-84 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="card-premium group relative flex flex-col justify-between p-5 rounded-3xl"
              >
                <div className="space-y-4">
                  {/* Image and Category Badge */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-blue-700 backdrop-blur-md border border-slate-200 shadow-sm">
                      {product.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 backdrop-blur-md shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {product.rating}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Add Button */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-extrabold text-slate-900 font-mono">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </div>
                    {product.original_price && (
                      <div className="text-[10px] text-slate-400 line-through font-mono">
                        ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* The 7-Stage Agentic Loop Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 relative overflow-hidden space-y-10 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-widest px-3 py-1 rounded-full bg-violet-50 border border-violet-200">
              Cognitive Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">The 7-Stage Agentic Commerce Loop</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike static chatbots, IntelliCart AI orchestrates an end-to-end cognitive feedback loop that grounds every decision in real transaction data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {[
              { step: '01. Observe', title: 'Context Ingestion', desc: 'Ingests natural-language specs, past orders, RFM profile, and category affinity.', icon: Compass },
              { step: '02. Reason', title: 'Multidimensional Fit', desc: 'Scores Budget Fit (35%), Use Case Fit (35%), Customer Fit (15%), and Rating Fit (15%).', icon: Cpu },
              { step: '03. Decide', title: 'Margin Guardrails', desc: 'Evaluates purchase probability; strictly suppresses discounts for high-intent shoppers.', icon: Shield },
              { step: '04. Learn', title: 'Telemetry & Recovery', desc: 'Logs decisions, auto-recovers failed payments via alternate rails, and retrains models.', icon: Zap }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-blue-400 transition-all duration-300 group hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-200 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">{item.step}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
