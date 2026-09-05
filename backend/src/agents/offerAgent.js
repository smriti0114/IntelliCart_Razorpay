const { calculate_offer } = require('../tools/agentTools');

/**
 * AI Offer / Pricing Agent
 * Protects merchant margins by refusing arbitrary discounts when purchase intent is high,
 * and selectively issuing targeted incentives only when hesitation is detected.
 */
async function evaluateOffer({ customer_id = 'cust_0001', cart_amount, purchase_probability }) {
  const prob = purchase_probability !== undefined ? Number(purchase_probability) : 0.82;
  const amount = Number(cart_amount || 68999);

  const offerResult = await calculate_offer({
    customer_id,
    cart_amount: amount,
    purchase_probability: prob
  });

  return offerResult;
}

module.exports = { evaluateOffer };
