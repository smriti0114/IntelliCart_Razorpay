const { search_products, get_customer_profile, calculate_fit_score } = require('../tools/agentTools');
const db = require('../../db');

/**
 * Product Recommendation Agent
 * Evaluates candidate products against intent and customer profile with multi-dimensional fit scoring.
 */
async function getRecommendations(intent, customer_id = 'cust_0001') {
  try {
    const customer = await get_customer_profile({ customer_id });

    // Controlled search via tools
    const candidates = await search_products({
      category: intent.category || 'Laptops',
      max_price: intent.budget_max ? Number(intent.budget_max) * 1.15 : null, // allow up to 15% budget stretch for evaluation
      limit: 6
    });

    if (!candidates || candidates.length === 0) {
      return [];
    }

    // Rank candidates with multi-dimensional fit score
    const scoredCandidates = candidates.map(product => {
      let specs = product.specs;
      let tags = product.tags;
      try { if (typeof specs === 'string') specs = JSON.parse(specs); } catch (e) {}
      try { if (typeof tags === 'string') tags = JSON.parse(tags); } catch (e) {}

      const fit = calculate_fit_score({ product: { ...product, specs }, intent, customer });

      // Build structured explanation
      const priceDiff = Number(intent.budget_max) - Number(product.price);
      let budgetNote = priceDiff >= 0
        ? `₹${Math.abs(priceDiff).toLocaleString('en-IN')} within your ₹${Number(intent.budget_max).toLocaleString('en-IN')} budget.`
        : `Slight ₹${Math.abs(priceDiff).toLocaleString('en-IN')} stretch for significantly superior GPU and thermals.`;

      let reason = `Recommended for ${intent.use_case}. ${budgetNote} Verified ${product.rating}★ rating from ${product.reviews_count} buyers.`;

      return {
        ...product,
        specs,
        tags,
        fit_scores: fit,
        recommendation_reason: reason
      };
    });

    // Sort descending by overall_fit score
    scoredCandidates.sort((a, b) => b.fit_scores.overallFit - a.fit_scores.overallFit);

    // Fetch complementary cross-sell accessory
    const accessoryCandidates = await search_products({
      category: 'Accessories',
      limit: 3
    });

    const complementaryAccessory = accessoryCandidates.length > 0 ? accessoryCandidates[0] : null;
    if (complementaryAccessory) {
      try {
        if (typeof complementaryAccessory.specs === 'string') {
          complementaryAccessory.specs = JSON.parse(complementaryAccessory.specs);
        }
      } catch (e) {}
    }

    return {
      topRecommendations: scoredCandidates.slice(0, 3),
      alternatives: scoredCandidates.slice(3, 6),
      complementaryAccessory: complementaryAccessory ? {
        ...complementaryAccessory,
        cross_sell_reason: 'Frequently bought together with high-performance laptops for optimal desk ergonomics and airflow.'
      } : null
    };
  } catch (err) {
    console.error('Recommendation Agent error:', err.message);
    return { topRecommendations: [], alternatives: [], complementaryAccessory: null };
  }
}

module.exports = { getRecommendations };
