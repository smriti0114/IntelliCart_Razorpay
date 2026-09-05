import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bot, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  AlertTriangle, RefreshCw, ShoppingCart, Star, Zap, Cpu, CreditCard,
  Layers, ArrowUpRight, Compass, Check, MessageSquare, Activity, ExternalLink,
  ChevronRight, Tag, Shield
} from 'lucide-react';

export default function AIShoppingPage() {
  const location = useLocation();
  const { addToCart, openPaymentModal, showToast } = useApp();
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your autonomous AI shopping copilot. Tell me what you need, your target budget, or specific hardware specs (e.g. "I need a laptop for coding and gaming under ₹70,000").',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStage, setThinkingStage] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeReasoning, setActiveReasoning] = useState([]);
  const [mobileTab, setMobileTab] = useState('chat'); // 'chat' or 'intel'
  const chatEndRef = useRef(null);

  const thinkingStages = [
    'Observing natural-language specs & budget constraints...',
    'Analyzing hardware candidates from 110+ catalog products...',
    'Computing 4-dimensional fit scores & trade-offs...',
    'Checking merchant margin guardrails & dynamic incentives...'
  ];

  useEffect(() => {
    let interval;
    if (isThinking) {
      setThinkingStage(0);
      interval = setInterval(() => {
        setThinkingStage((prev) => (prev + 1) % thinkingStages.length);
      }, 1100);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setInputPrompt(q);
      executePrompt(q);
    }
  }, [location.search]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const executePrompt = async (promptText) => {
    if (!promptText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);
    setActiveReasoning([]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          customer_id: 'cust_0001',
          session_id: `sess_${Date.now()}`
        })
      });
      const data = await res.json();
      setIsThinking(false);

      if (data.success) {
        setCurrentResult(data);
        setActiveReasoning(data.reasoningTrace || []);

        const aiMsg = {
          sender: 'ai',
          text: `I evaluated our hardware catalog and selected "${data.topPick?.name}" as your highest-scoring recommendation. It matches your use case (${data.intent.use_case}) with an overall fit score of ${data.topPick?.fit_scores.overallFit}% while remaining within your ₹${Number(data.intent.budget_max).toLocaleString('en-IN')} budget ceiling.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          result: data
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        showToast('AI Shopping Agent encountered an error', 'error');
      }
    } catch (err) {
      setIsThinking(false);
      showToast('Failed to reach AI service', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executePrompt(inputPrompt);
  };

  const handleDirectCheckout = (product) => {
    openPaymentModal({
      order: {
        id: `ord_${Date.now()}`,
        total_amount: product.price,
        product_name: product.name
      },
      onSuccess: () => {
        showToast(`Order for ${product.name} paid successfully!`, 'success');
      },
      onFailure: (errData) => {
        showToast(`Payment failed: ${errData.reason}. AI Recovery initiated.`, 'error');
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-[calc(100vh-76px)] flex flex-col space-y-3">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex p-1 bg-slate-950/80 rounded-2xl border border-white/10 shrink-0">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'chat'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat Copilot</span>
        </button>
        <button
          onClick={() => setMobileTab('intel')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'intel'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Agent Intel & Fit Canvas</span>
          {currentResult && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Column: Conversational Chat Stream */}
        <div className={`w-full lg:w-1/2 flex flex-col glass-panel-elevated border border-white/15 rounded-3xl overflow-hidden shadow-2xl ${
          mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Chat Header with Neural Status */}
          <div className="px-6 py-4 border-b border-white/10 bg-slate-950/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-60 animate-pulse" />
                <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  IntelliCart AI Copilot
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">Observe → Analyze → Reason → Decide → Act</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono border border-indigo-500/30">
              Gemini 2.5 Flash
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-indigo-950/40 font-medium'
                        : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none shadow-sm font-normal'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[10px] mt-1.5 opacity-60 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* In-Stream Product Card Recommendation */}
                  {msg.result?.topPick && (
                    <div className="p-4 rounded-2xl bg-[#090E1D] border border-indigo-500/30 shadow-xl space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                          ⭐ {msg.result.topPick.fit_scores?.overallFit}% FIT SCORE MATCH
                        </span>
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {msg.result.topPick.rating}
                        </span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <img
                          src={msg.result.topPick.image_url}
                          alt={msg.result.topPick.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{msg.result.topPick.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{msg.result.topPick.category}</p>
                          <p className="text-sm font-black text-white font-mono mt-1">
                            ₹{Number(msg.result.topPick.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleDirectCheckout(msg.result.topPick)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Buy with Razorpay</span>
                        </button>
                        <button
                          onClick={() => addToCart(msg.result.topPick)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-white/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Cognitive Agent Thinking Stage Indicator */}
            {isThinking && (
              <div className="flex gap-3 items-center text-xs text-indigo-300 bg-indigo-950/50 p-3.5 rounded-2xl border border-indigo-500/40 w-fit animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block text-[11px]">IntelliCart Reasoning:</span>
                  <span className="text-[11px] text-indigo-200">{thinkingStages[thinkingStage]}</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar with Glowing Border */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="E.g. I need a laptop for coding and gaming under ₹70,000"
                className="flex-1 bg-slate-900/90 border border-white/10 text-xs text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner font-medium"
              />
              <button
                type="submit"
                disabled={isThinking || !inputPrompt.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/30 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Send</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick chip triggers */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[
                'Coding & gaming laptop under ₹70k',
                'Studio ANC headphones under ₹10k',
                '5G camera phone under ₹45k'
              ].map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => executePrompt(chip)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors hover:-translate-y-0.5 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Reasoning Trace, Fit Canvas & Action Cards */}
        <div className={`w-full lg:w-1/2 flex flex-col overflow-y-auto space-y-6 pr-1 ${
          mobileTab === 'intel' ? 'flex' : 'hidden lg:flex'
        }`}>
          {currentResult ? (
            <>
              {/* 1. Agent Reasoning Trace Panel */}
              <div className="p-6 rounded-3xl glass-panel-elevated border border-white/15 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                      Observable Reasoning Trace
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" /> DECISION EXECUTED
                  </span>
                </div>

                {/* Connected Timeline Steps */}
                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-emerald-500">
                  {activeReasoning.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:border-purple-400 transition-colors" />
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs space-y-1 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300 font-mono">
                          <span>[{step.step}] {step.title}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Top Ranked Product Recommendation Card */}
              {currentResult.topPick && (
                <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900/95 to-slate-950 border border-indigo-500/40 shadow-2xl space-y-5 animate-pulse-border">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black tracking-wide font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      Top Recommended Fit ({currentResult.topPick.fit_scores?.overallFit}% Match)
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {currentResult.topPick.rating} ({currentResult.topPick.reviews_count} reviews)
                    </div>
                  </div>

                  {/* Product Info & Image */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shrink-0">
                      <img
                        src={currentResult.topPick.image_url}
                        alt={currentResult.topPick.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base font-extrabold text-white leading-tight">
                        {currentResult.topPick.name}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {currentResult.topPick.recommendation_reason}
                      </p>
                      <div className="text-2xl font-black text-white pt-1 font-mono">
                        ₹{Number(currentResult.topPick.price).toLocaleString('en-IN')}
                        {currentResult.topPick.original_price && (
                          <span className="text-xs text-slate-500 line-through ml-2 font-normal">
                            ₹{Number(currentResult.topPick.original_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-Dimensional Fit Score Meters */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Multidimensional Product Fit Breakdown
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Budget Fit (35%)</span>
                          <span className="text-white font-bold font-mono">{currentResult.topPick.fit_scores?.budgetFit}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-1000"
                            style={{ width: `${currentResult.topPick.fit_scores?.budgetFit}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Use Case Fit (35%)</span>
                          <span className="text-white font-bold font-mono">{currentResult.topPick.fit_scores?.useCaseFit}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-400 rounded-full transition-all duration-1000"
                            style={{ width: `${currentResult.topPick.fit_scores?.useCaseFit}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Customer Affinity (15%)</span>
                          <span className="text-white font-bold font-mono">{currentResult.topPick.fit_scores?.customerFit}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-400 rounded-full transition-all duration-1000"
                            style={{ width: `${currentResult.topPick.fit_scores?.customerFit}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-400 mb-1">
                          <span>Rating Fit (15%)</span>
                          <span className="text-white font-bold font-mono">{currentResult.topPick.fit_scores?.ratingFit}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-1000"
                            style={{ width: `${currentResult.topPick.fit_scores?.ratingFit}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Offer Agent Decision Pill */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2.5 text-xs text-indigo-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">AI Margin Guardrail: </span>
                      <span className="font-semibold">{currentResult.offerDecision?.decision} ({currentResult.offerDecision?.discount_percentage}% discount). </span>
                      <p className="text-[11px] text-indigo-300/80 mt-0.5">{currentResult.offerDecision?.reason}</p>
                    </div>
                  </div>

                  {/* Complementary Cross-Sell Accessory */}
                  {currentResult.complementaryAccessory && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={currentResult.complementaryAccessory.image_url}
                          alt={currentResult.complementaryAccessory.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide font-mono">
                            Frequently Paired Accessory
                          </span>
                          <h5 className="text-xs font-bold text-white truncate">
                            {currentResult.complementaryAccessory.name}
                          </h5>
                          <p className="text-xs font-black text-indigo-400 font-mono">
                            ₹{Number(currentResult.complementaryAccessory.price).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(currentResult.complementaryAccessory)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors shrink-0 cursor-pointer"
                      >
                        + Add Accessory
                      </button>
                    </div>
                  )}

                  {/* Checkout Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleDirectCheckout(currentResult.topPick)}
                      className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      Instant Checkout with Razorpay (₹{Number(currentResult.topPick.price).toLocaleString('en-IN')})
                    </button>
                    <button
                      onClick={() => addToCart(currentResult.topPick)}
                      className="py-3.5 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty Initial State */
            <div className="h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl glass-panel-elevated border border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse-glow">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-black text-white tracking-tight">Autonomous Agent Workspace</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Type your specifications into the chat. The AI agent will parse intent, rank products, evaluate multidimensional fit, and preserve merchant margins in real-time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

