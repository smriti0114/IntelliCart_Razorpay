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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-violet-700 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Autonomous Growth Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" />
              Scanning Catalog & Funnels
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Autonomous AI Growth Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time revenue opportunity discovery, merchant trust layer approvals, and executive diagnostic assistant
          </p>
        </div>

        <button
          onClick={fetchGrowthData}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all flex items-center gap-2 w-fit shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rescan Data</span>
        </button>
      </div>

      {/* 1. Autonomous Opportunity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>AI-Discovered Revenue Opportunities</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-violet-700 border border-blue-200">
              {opportunities.length} Actionable
            </span>
          </h2>
          <span className="text-[11px] text-slate-500">Ranked by Expected Incremental Revenue</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-6 rounded-3xl card-premium border border-slate-200 flex flex-col justify-between space-y-5 shadow-sm relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-violet-700 border border-blue-200">
                      {opp.confidence}% AI Confidence
                    </span>
                  </div>
                  <span className="text-sm font-black text-emerald-600 font-mono tracking-tight flex items-center gap-1">
                    +{opp.potential_revenue}
                  </span>
                </div>

                {/* Animated Confidence Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${opp.confidence}%` }}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {opp.opportunity}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{opp.reason}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Recommended Action
                  </span>
                  <p className="leading-relaxed">{opp.recommended_action}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleApproveAction('act_001')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Agent Safety & Trust Layer (Pending Authorizations)
              </h3>
              <p className="text-xs text-slate-500">Merchant approval required before autonomous campaign dispatch</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            Safety Guardrail #18 Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {actions.map((act) => {
            const isApproved = act.status === 'APPROVED' || act.status === 'EXECUTED';
            const isRejected = act.status === 'REJECTED';

            return (
              <div key={act.id} className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-violet-700 font-mono border border-blue-200">
                      {act.agent_name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">{act.confidence}% Confidence</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{act.description}</p>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Expected Impact: {act.expected_impact}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isApproved ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved & Dispatched
                    </span>
                  ) : isRejected ? (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproveAction(act.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Action
                      </button>
                      <button
                        onClick={() => handleRejectAction(act.id)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Merchant Diagnostic AI Assistant
              </h3>
              <p className="text-xs text-slate-500">Ask data-backed questions grounded directly in real PostgreSQL transactions</p>
            </div>
          </div>

          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-violet-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-blue-600" /> RAG & SQL Diagnostic Mode
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
              className="flex-1 px-4 py-3 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={isAsking || !merchantQuestion.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
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
                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-violet-700 text-[11px] border border-slate-200 transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Response History */}
        <div className="space-y-4 pt-2">
          {chatLog.map((entry, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs text-violet-700 font-semibold border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Merchant: "{entry.q}"
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{entry.timestamp}</span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {entry.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
