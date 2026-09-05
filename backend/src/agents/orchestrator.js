const { parseCustomerIntent } = require('./intentAgent');
const { getRecommendations } = require('./recommendationAgent');
const { evaluateOffer } = require('./offerAgent');
const db = require('../../db');
const { getIO } = require('../utils/socket');
const axios = require('axios');

/**
 * Master Agent Orchestrator
 * Implements the complete Agentic Commerce Loop:
 * OBSERVE -> ANALYZE -> REASON -> DECIDE -> TAKE ACTION -> MEASURE -> LEARN
 */
async function processAgenticShoppingFlow({ userPrompt, customer_id = 'cust_0001', session_id = 'sess_demo' }) {
  const reasoningTrace = [];

  // 1. OBSERVE
  reasoningTrace.push({
    step: 'OBSERVE',
    title: 'Customer Context Ingestion',
    detail: `Observed natural-language customer prompt: "${userPrompt}". Fetching customer profile and preferences for ID: ${customer_id}.`
  });

  // 2. ANALYZE (Intent Extraction)
  const intent = await parseCustomerIntent(userPrompt);
  reasoningTrace.push({
    step: 'ANALYZE',
    title: 'Commerce Intent Extraction',
    detail: `Identified target category: "${intent.category}", budget ceiling: ₹${intent.budget_max.toLocaleString('en-IN')}, primary use case: "${intent.use_case}". Detected preferences: [${intent.preferences.join(', ') || 'Standard specs'}].`
  });

  // 3. REASON (Catalog Search & Multi-Dimensional Fit Scoring)
  const recommendationsData = await getRecommendations(intent, customer_id);
  const topPick = recommendationsData.topRecommendations[0] || null;

  reasoningTrace.push({
    step: 'REASON',
    title: 'Multidimensional Fit & Trade-off Scoring',
    detail: topPick
      ? `Ranked ${recommendationsData.topRecommendations.length} candidate products. Top pick: "${topPick.name}" with Overall Fit: ${topPick.fit_scores.overallFit}% (Budget Fit: ${topPick.fit_scores.budgetFit}%, Use Case Fit: ${topPick.fit_scores.useCaseFit}%, Rating Fit: ${topPick.fit_scores.ratingFit}%). Complementary accessory identified: "${recommendationsData.complementaryAccessory?.name || 'Aluminum Stand'}".`
      : 'Evaluated catalog based on available inventory and ratings.'
  });

  // Fetch ML Purchase Probability (Model A) or use smart probabilistic estimation
  let purchaseProbability = 0.82;
  try {
    const mlRes = await axios.post('http://127.0.0.1:8000/predict-purchase', {
      session_id,
      customer_id,
      cart_amount: topPick ? Number(topPick.price) : 68999,
      aov: 55000,
      previous_orders: 3
    }, { timeout: 1500 });
    if (mlRes.data && mlRes.data.confidence_score !== undefined) {
      purchaseProbability = Number(mlRes.data.confidence_score);
    }
  } catch (e) {
    // Graceful fallback: Calculate probability from fit score
    purchaseProbability = topPick ? +(topPick.fit_scores.overallFit / 100 * 0.9).toFixed(2) : 0.80;
  }

  // 4. DECIDE (Offer Agent & Margin Guardrails)
  const offerDecision = await evaluateOffer({
    customer_id,
    cart_amount: topPick ? Number(topPick.price) : 68999,
    purchase_probability: purchaseProbability
  });

  reasoningTrace.push({
    step: 'DECIDE',
    title: 'Margin-Safe Pricing & Incentive Evaluation',
    detail: `Purchase Intent Probability: ${Math.round(purchaseProbability * 100)}%. Decision: ${offerDecision.decision}. ${offerDecision.reason}`
  });

  // 5. TAKE ACTION (Telemetry Logging & WebSocket Broadcast)
  const decisionId = `dec_${Date.now()}`;
  await db.query(
    `INSERT INTO agent_decisions (id, session_id, customer_id, decision_type, input_payload, output_payload, confidence_score, status, discount_percentage, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      decisionId,
      session_id,
      customer_id,
      'PRODUCT_RECOMMENDED_AND_PRICED',
      JSON.stringify({ prompt: userPrompt, intent, customer_id }),
      JSON.stringify({ topPickId: topPick?.id, offerDecision }),
      purchaseProbability,
      'AUTO_EXECUTED',
      offerDecision.discount_percentage,
      new Date().toISOString()
    ]
  );

  // Broadcast live telemetry update to Merchant Dashboards
  const io = getIO();
  if (io) {
    io.emit('telemetry_update', {
      id: decisionId,
      decision_type: 'PRODUCT_RECOMMENDED_AND_PRICED',
      customer_id,
      confidence_score: purchaseProbability,
      discount_percentage: offerDecision.discount_percentage,
      status: 'AUTO_EXECUTED',
      created_at: new Date().toISOString()
    });
  }

  reasoningTrace.push({
    step: 'MEASURE_AND_LEARN',
    title: 'Audit Logging & Feedback Loop Dispatch',
    detail: `Logged decision #${decisionId} to PostgreSQL audit ledger. Emitted real-time WebSocket telemetry event to merchant console. Awaiting order conversion to update retention weights.`
  });

  return {
    success: true,
    intent,
    recommendations: recommendationsData.topRecommendations,
    alternatives: recommendationsData.alternatives,
    complementaryAccessory: recommendationsData.complementaryAccessory,
    topPick,
    offerDecision,
    purchaseProbability: Math.round(purchaseProbability * 100),
    reasoningTrace
  };
}

module.exports = { processAgenticShoppingFlow };
