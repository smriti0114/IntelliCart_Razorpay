import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, ArrowRight, Bot, Shield, CheckCircle2, Star, Zap, ShoppingCart,
  Layers, ArrowUpRight, Cpu, Compass, Lock, Check
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
    <div className="space-y-16 pb-24 bg-grid-pattern relative">
      {/* Hero Section with Ambient Lights */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        {/* Soft Radial Backlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 right-10 w-[380px] h-[380px] bg-purple-600/12 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-indigo-300 text-xs font-semibold tracking-wide shadow-lg shadow-indigo-950/40 animate-float backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono">INTELLICART AI 2.4 — AUTONOMOUS COMMERCE ENGINE</span>
          </div>

          {/* Shimmering Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Discover, Compare & Buy with{' '}
            <span className="shimmer-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Agentic Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            IntelliCart AI actively parses your hardware intent, executes 4-dimension fit scoring, protects merchant margins, and auto-recovers checkout friction in real-time.
          </p>

          {/* Interactive Agent Search Box */}
          <div className="max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500" />
              <div className="relative flex items-center bg-[#0C1220]/95 border border-white/15 rounded-2xl p-2 shadow-2xl backdrop-blur-xl group-focus-within:border-indigo-500 transition-colors">
                <Bot className="w-5 h-5 text-indigo-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask anything (e.g. 'I need a laptop for coding and gaming under ₹70,000')"
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
                  className="px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-[11px] hover:-translate-y-0.5 cursor-pointer"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10 shadow-2xl">
          <div className="text-center space-y-1 p-2">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">₹6.3Cr+</p>
            <p className="text-xs text-slate-400 font-medium">Total Settled Revenue</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-white/10">
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tight font-mono">97.2%</p>
            <p className="text-xs text-slate-400 font-medium">Fit Score Accuracy</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-white/10">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">₹50.7L+</p>
            <p className="text-xs text-slate-400 font-medium">AI Recovered Revenue</p>
          </div>
          <div className="text-center space-y-1 p-2 border-l border-white/10">
            <p className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight font-mono">0%</p>
            <p className="text-xs text-slate-400 font-medium">Margin Discount Erosion</p>
          </div>
        </div>
      </section>

      {/* Featured Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Trending Hardware & Gadgets</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">High-throughput developer workstations, flagship phones, and accessories</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors"
          >
            <span>Explore All 110+ Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-84 rounded-3xl bg-slate-900/60 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const discountPct = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="card-premium group relative flex flex-col justify-between p-5 rounded-3xl"
                >
                  <div className="space-y-4">
                    {/* Image and Category Badge */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-white/10 font-mono">
                        {product.category}
                      </span>
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {discountPct > 0 && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono backdrop-blur-md">
                            {discountPct}% OFF
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 backdrop-blur-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Add Button */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-white font-mono">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </div>
                      {product.original_price && (
                        <div className="text-[10px] text-slate-500 line-through font-mono">
                          ₹{Number(product.original_price).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* The 7-Stage Agentic Loop Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-elevated border border-white/10 relative overflow-hidden space-y-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[130px] pointer-events-none" />

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 font-mono">
              Cognitive Agent Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">The 7-Stage Agentic Commerce Loop</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike static chatbots, IntelliCart AI orchestrates an end-to-end cognitive feedback loop grounded directly in transaction telemetry.
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
                  className="p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 hover:border-indigo-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider font-mono">{item.step}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

