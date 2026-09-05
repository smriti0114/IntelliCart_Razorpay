import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Bot, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  AlertTriangle, RefreshCw, ShoppingCart, Star, Zap, Cpu, CreditCard,
  Layers, ArrowUpRight, Compass, Check
} from 'lucide-react';

export default function AIShoppingPage() {
  const location = useLocation();
  const { addToCart, openPaymentModal, showToast } = useApp();
  
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your autonomous AI shopping copilot. Tell me what you need, your budget, and specific use case (e.g. "I need a laptop for coding and gaming under ₹70,000").',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeReasoning, setActiveReasoning] = useState([]);
  const chatEndRef = useRef(null);

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
          text: `I analyzed our catalog and found the top match for ${data.intent.use_case}: "${data.topPick?.name}". It scores an overall fit of ${data.topPick?.fit_scores.overallFit}% while staying within your ₹${Number(data.intent.budget_max).toLocaleString('en-IN')} budget.`,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-6">
      {/* Left Column: Conversational Chat Stream */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Chat Header with Neural Status */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur-sm opacity-35 animate-pulse" />
              <div className="relative w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-violet-600 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                IntelliCart Copilot
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Observe → Analyze → Reason → Decide → Act</p>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono border border-blue-200 font-semibold">
            Gemini 2.5 + Scikit-Learn
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-violet-600 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`block text-[10px] mt-1.5 font-mono text-right ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center shrink-0 text-cyan-700 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-blue-700 bg-blue-50 p-3 rounded-2xl border border-blue-200 w-fit animate-pulse shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-violet-600" />
              <span>AI Agent is observing specs, evaluating catalog, and calculating fit...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="E.g. I need a laptop for coding and gaming under ₹70,000"
              className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isThinking || !inputPrompt.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-all shadow-md shadow-blue-600/25 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Send</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
          {/* Quick chip triggers */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {[
              'Coding & gaming laptop under ₹70k',
              'ANC headphones under ₹10k',
              '5G camera phone under ₹40k'
            ].map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => executePrompt(chip)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors hover:-translate-y-0.5 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Reasoning Trace, Fit Canvas & Action Cards */}
      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto space-y-6 pr-1">
        {currentResult ? (
          <>
            {/* 1. Agent Reasoning Trace Panel with Connected Visual Nodes */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Observable Agent Reasoning Pipeline
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> DECISION EXECUTED
                </span>
              </div>

              {/* Connected Timeline Steps */}
              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-cyan-500 before:to-emerald-500">
                {activeReasoning.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-white border-2 border-blue-600 group-hover:border-cyan-500 transition-colors shadow-sm" />
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                        <span>[{step.step}] {step.title}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Top Ranked Product Recommendation Card */}
            {currentResult.topPick && (
              <div className="p-6 rounded-3xl bg-white border-2 border-blue-500/40 shadow-xl space-y-5 animate-pulse-border">
                {/* Glow pill badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    Top Recommended Fit ({currentResult.topPick.fit_scores?.overallFit}% Match)
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {currentResult.topPick.rating} ({currentResult.topPick.reviews_count} reviews)
                  </div>
                </div>

                {/* Product Info & Image */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={currentResult.topPick.image_url}
                      alt={currentResult.topPick.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {currentResult.topPick.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {currentResult.topPick.recommendation_reason}
                    </p>
                    <div className="text-2xl font-black text-slate-900 pt-1 font-mono">
                      ₹{Number(currentResult.topPick.price).toLocaleString('en-IN')}
                      {currentResult.topPick.original_price && (
                        <span className="text-xs text-slate-400 line-through ml-2 font-normal">
                          ₹{Number(currentResult.topPick.original_price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multi-Dimensional Fit Score Meters */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Multidimensional Product Fit Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Budget Fit</span>
                        <span className="text-slate-900 font-bold">{currentResult.topPick.fit_scores?.budgetFit}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                          style={{ width: `${currentResult.topPick.fit_scores?.budgetFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Use Case Fit</span>
                        <span className="text-slate-900 font-bold">{currentResult.topPick.fit_scores?.useCaseFit}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                          style={{ width: `${currentResult.topPick.fit_scores?.useCaseFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Customer Fit</span>
                        <span className="text-slate-900 font-bold">{currentResult.topPick.fit_scores?.customerFit}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000"
                          style={{ width: `${currentResult.topPick.fit_scores?.customerFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-600 mb-1">
                        <span>Rating Fit</span>
                        <span className="text-slate-900 font-bold">{currentResult.topPick.fit_scores?.ratingFit}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000"
                          style={{ width: `${currentResult.topPick.fit_scores?.ratingFit}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Offer Agent Decision Pill */}
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-950">AI Offer Agent: </span>
                    <span className="font-semibold">{currentResult.offerDecision?.decision} ({currentResult.offerDecision?.discount_percentage}% discount). </span>
                    <p className="text-[11px] text-blue-700 mt-0.5">{currentResult.offerDecision?.reason}</p>
                  </div>
                </div>

                {/* Complementary Cross-Sell Accessory */}
                {currentResult.complementaryAccessory && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentResult.complementaryAccessory.image_url}
                        alt={currentResult.complementaryAccessory.name}
                        className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wide">
                          Recommended Accessory
                        </span>
                        <h5 className="text-xs font-bold text-slate-900">
                          {currentResult.complementaryAccessory.name}
                        </h5>
                        <p className="text-xs font-extrabold text-violet-600 font-mono">
                          ₹{Number(currentResult.complementaryAccessory.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(currentResult.complementaryAccessory)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                      + Add Accessory
                    </button>
                  </div>
                )}

                {/* Checkout Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDirectCheckout(currentResult.topPick)}
                    className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    Instant Checkout with Razorpay (₹{Number(currentResult.topPick.price).toLocaleString('en-IN')})
                  </button>
                  <button
                    onClick={() => addToCart(currentResult.topPick)}
                    className="py-3.5 px-4 rounded-xl font-semibold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty Initial State on the Right */
          <div className="h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-violet-600 animate-pulse-glow">
              <Bot className="w-8 h-8" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-extrabold text-slate-900">Autonomous Agent Workspace</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Type your specifications in the chat. The AI agent will parse intent, rank products, evaluate multidimensional fit, and preserve merchant margins in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
