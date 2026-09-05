import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, CheckCircle2, XCircle, ShieldAlert, Bot, ArrowRight, 
  Send, RefreshCw, Layers, DollarSign, ArrowUpRight
} from 'lucide-react';

export default function AIGrowthPage() {
  const { showToast } = useApp();
  const [opportunities, setOpportunities] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Merchant Conversational AI Chat state
  const [merchantQuestion, setMerchantQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      q: 'How can I increase revenue by 10%?',
      a: `### Data-Backed 10% Growth Strategy (+₹63.4 Lakhs)\n\n1. **Payment Failure Recovery (+₹18.4L):** Automate WhatsApp/SMS retry prompts for 24 failed UPI transactions within 15 minutes. Current recovery benchmark is 65%.\n2. **Accessory Upsell at Checkout (+₹28.5L):** Present high-margin tech accessories (ErgoElevate stand, VoltCharge GaN charger) to laptop buyers. Will elevate AOV from ₹30,231 to ₹31,730.\n3. **Suppress Blanket Discounts on High-Intent Buyers (+₹16.5L):** Cease giving unnecessary discounts to customers with purchase probability >80%.\n\n**Ready to execute?** Approve the pending campaigns below.`,
      timestamp: '11:42 AM'
    }
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const fetchGrowthData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/ai/growth-analysis').then((r) => r.json()),
      fetch('/api/ai/actions').then((r) => r.json())
    ])
      .then(([growthData, actionsData]) => {
        setOpportunities(growthData.opportunities || []);
        setActions(actionsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const handleApproveAction = async (actionId) => {
    try {
      const res = await fetch('/api/ai/action/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Action approved! Growth Agent dispatched campaign.', 'success');
        setActions((prev) =>
          prev.map((a) => (a.id === actionId ? { ...a, status: 'APPROVED' } : a))
        );
      }
    } catch (err) {
      showToast('Failed to approve action', 'error');
    }
  };

  const handleRejectAction = async (actionId) => {
    try {
      const res = await fetch('/api/ai/action/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_id: actionId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Action rejected by merchant.', 'info');
        setActions((prev) =>
          prev.map((a) => (a.id === actionId ? { ...a, status: 'REJECTED' } : a))
        );
      }
    } catch (err) {
      showToast('Failed to reject action', 'error');
    }
  };

  const handleAskMerchantAssistant = async (e) => {
    e.preventDefault();
    if (!merchantQuestion.trim()) return;

    const q = merchantQuestion;
    setMerchantQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch('/api/ai/merchant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      setIsAsking(false);

      if (data.success) {
        setChatLog((prev) => [
          {
            q,
            a: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev
        ]);
      } else {
        showToast('Assistant query failed', 'error');
      }
    } catch (err) {
      setIsAsking(false);
      showToast('Failed to reach AI assistant', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Autonomous Growth Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" />
              Scanning Catalog & Funnels
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Autonomous AI Growth Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time revenue opportunity discovery, merchant trust layer approvals, and executive diagnostic assistant
          </p>
        </div>

        <button
          onClick={fetchGrowthData}
          className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 w-fit shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rescan Data</span>
        </button>
      </div>

      {/* 1. Autonomous Opportunity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>AI-Discovered Revenue Opportunities</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {opportunities.length} Actionable
            </span>
          </h2>
          <span className="text-[11px] text-slate-400">Ranked by Expected Incremental Revenue</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-6 rounded-3xl card-premium flex flex-col justify-between space-y-5 shadow-2xl relative overflow-hidden group"
            >
              {/* Corner ambient glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {opp.confidence}% AI Confidence
                    </span>
                  </div>
                  <span className="text-sm font-black text-emerald-400 font-mono tracking-tight flex items-center gap-1">
                    +{opp.potential_revenue}
                  </span>
                </div>

                {/* Animated Confidence Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-1000"
                    style={{ width: `${opp.confidence}%` }}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors">
                    {opp.opportunity}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{opp.reason}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Recommended Action
                  </span>
                  <p className="leading-relaxed">{opp.recommended_action}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleApproveAction('act_001')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <span>Approve & Execute Action</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Merchant Safety & Trust Layer (Human-in-the-Loop Approvals) */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Agent Safety & Trust Layer (Pending Authorizations)
              </h3>
              <p className="text-xs text-slate-400">Merchant approval required before autonomous campaign dispatch</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            Safety Guardrail #18 Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {actions.map((act) => {
            const isApproved = act.status === 'APPROVED' || act.status === 'EXECUTED';
            const isRejected = act.status === 'REJECTED';

            return (
              <div key={act.id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono border border-slate-700">
                      {act.agent_name}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">{act.confidence}% Confidence</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Expected Impact: {act.expected_impact}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isApproved ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Dispatched
                    </span>
                  ) : isRejected ? (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproveAction(act.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5 hover:scale-105"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Action
                      </button>
                      <button
                        onClick={() => handleRejectAction(act.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Merchant Conversational Diagnostic Assistant */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Merchant Diagnostic AI Assistant
              </h3>
              <p className="text-xs text-slate-400">Ask data-backed questions grounded directly in real transactional telemetry</p>
            </div>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-purple-400" /> RAG & Telemetry Diagnostic Mode
          </span>
        </div>

        {/* Input Box with Preset Chips */}
        <div className="space-y-3">
          <form onSubmit={handleAskMerchantAssistant} className="flex gap-2">
            <input
              type="text"
              value={merchantQuestion}
              onChange={(e) => setMerchantQuestion(e.target.value)}
              placeholder="Ask: 'Why did revenue fall this week?' or 'How can I increase revenue by 10%?'"
              className="flex-1 px-4 py-3 text-xs bg-slate-950/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isAsking || !merchantQuestion.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isAsking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Ask Agent</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Diagnostic Queries:</span>
            {[
              'Why did revenue fall this week?',
              'How can I increase revenue by 10%?',
              'Which customer segment has highest churn risk?'
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => setMerchantQuestion(preset)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] border border-slate-800 transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Response History */}
        <div className="space-y-4 pt-2">
          {chatLog.map((entry, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-purple-300 font-semibold border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Merchant: "{entry.q}"
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{entry.timestamp}</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans prose prose-invert max-w-none">
                {entry.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
