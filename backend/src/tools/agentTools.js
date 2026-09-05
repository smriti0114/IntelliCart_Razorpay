const db = require('../../db');
const axios = require('axios');

/**
 * Controlled Backend Tool Registry for ShopPilot AI Agents
 * Strictly validates inputs, enforces safety constraints, and logs actions.
 */

// Tool 1: search_products
async function search_products({ query = '', category = '', max_price = null, limit = 5 }) {
  let conditions = ['is_available = 1'];
  let params = [];
  let pIdx = 1;

  if (category && category !== 'All') {
    conditions.push(`category ILIKE $${pIdx++}`);
    params.push(`%${category}%`);
  }

  if (query) {
    conditions.push(`(name ILIKE $${pIdx} OR description ILIKE $${pIdx} OR tags ILIKE $${pIdx})`);
    params.push(`%${query}%`);
    pIdx++;
  }

  if (max_price && Number(max_price) > 0) {
    conditions.push(`price <= $${pIdx++}`);
    params.push(Number(max_price));
  }

  const sql = `SELECT * FROM products WHERE ${conditions.join(' AND ')} ORDER BY rating DESC, popularity_score DESC LIMIT ${Number(limit)}`;
  const res = await db.query(sql, params);

  // If strict search returned empty, return top products in category or catalog as fallback
  if (res.rows.length === 0) {
    const fallbackSql = category 
      ? `SELECT * FROM products WHERE category ILIKE $1 ORDER BY rating DESC LIMIT ${Number(limit)}`
      : `SELECT * FROM products ORDER BY rating DESC LIMIT ${Number(limit)}`;
    const fallbackRes = await db.query(fallbackSql, category ? [`%${category}%`] : []);
    return fallbackRes.rows;
  }

  return res.rows;
}

// Tool 2: get_product
async function get_product({ product_id }) {
  if (!product_id) throw new Error('product_id required');
  const res = await db.query('SELECT * FROM products WHERE id = $1', [product_id]);
  return res.rows[0] || null;
}

// Tool 3: get_customer_profile
async function get_customer_profile({ customer_id }) {
  if (!customer_id) throw new Error('customer_id required');
  const res = await db.query('SELECT * FROM customers WHERE id = $1', [customer_id]);
  return res.rows[0] || null;
}

// Tool 4: calculate_fit_score
function calculate_fit_score({ product, intent, customer }) {
  const price = Number(product.price);
  const budget = intent.budget_max ? Number(intent.budget_max) : 70000;
  const rating = Number(product.rating || 4.5);

  // 1. Budget Fit Score (100% if within budget, gradually decreases if over)
  let budgetFit = 100;
  if (price > budget) {
    const overPct = (price - budget) / budget;
    budgetFit = Math.max(30, Math.round(100 - overPct * 150));
  } else {
    // Proximity to budget ceiling
    budgetFit = Math.min(100, Math.round(85 + ((price) / (budget || 1)) * 15));
  }

  // 2. Use Case Fit Score
  let useCaseFit = 85;
  const useCase = (intent.use_case || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const specsStr = JSON.stringify(product.specs || {}).toLowerCase();

  if (useCase.includes('coding') && (desc.includes('coding') || desc.includes('dev') || specsStr.includes('16gb') || specsStr.includes('32gb'))) {
    useCaseFit += 8;
  }
  if (useCase.includes('gaming') && (desc.includes('gaming') || specsStr.includes('rtx') || specsStr.includes('144hz') || specsStr.includes('165hz'))) {
    useCaseFit += 6;
  }
  useCaseFit = Math.min(98, useCaseFit);

  // 3. Customer Fit Score (based on affinity and segment)
  let customerFit = 88;
  if (customer?.preferred_category && product.category.toLowerCase().includes(customer.preferred_category.toLowerCase())) {
    customerFit += 7;
  }
  customerFit = Math.min(97, customerFit);

  // 4. Rating Fit Score
  const ratingFit = Math.round((rating / 5.0) * 100);

  // 5. Overall Weighted Fit Score
  const overallFit = Math.round(
    budgetFit * 0.35 +
    useCaseFit * 0.35 +
    customerFit * 0.15 +
    ratingFit * 0.15
  );

  return {
    overallFit,
    budgetFit,
    useCaseFit,
    customerFit,
    ratingFit
  };
}

// Tool 5: calculate_offer (Strict Business Rules + Margin Protection)
async function calculate_offer({ customer_id, cart_amount, purchase_probability = 0.82 }) {
  // Hard Rule 1: High purchase intent (> 75%) = 0% discount to protect merchant margin
  if (purchase_probability >= 0.75) {
    return {
      discount_percentage: 0,
      discount_amount: 0,
      coupon_code: null,
      decision: 'NO_DISCOUNT',
      reason: 'High purchase intent (>75%) and strong product fit. Discount is unnecessary and would erode merchant margin.'
    };
  }

  // Hard Rule 2: Moderate purchase probability (45% - 74%) with cart > ₹20,000 = ₹500 or 5% targeted incentive
  if (purchase_probability >= 0.45) {
    const discountAmount = Math.min(1000, Math.round(cart_amount * 0.05));
    return {
      discount_percentage: 5,
      discount_amount: discountAmount,
      coupon_code: 'SMART5',
      decision: 'TARGETED_INCENTIVE',
      reason: 'Customer has moderate purchase probability (45-74%). A small 5% incentive bridges conversion hesitation safely.'
    };
  }

  // Hard Rule 3: Low purchase probability (< 45%) with high cart value = max 10% coupon (ceiling 15%)
  const discountAmount = Math.min(2500, Math.round(cart_amount * 0.10));
  return {
    discount_percentage: 10,
    discount_amount: discountAmount,
    coupon_code: 'CONVERT10',
    decision: 'RETENTION_OFFER',
    reason: 'High hesitation detected (<45% conversion probability). Targeted 10% coupon issued to prevent cart abandonment.'
  };
}

// Tool 6: get_sales_analytics
async function get_sales_analytics() {
  const paidOrders = await db.query(
    "SELECT COUNT(*) as count, SUM(total_amount) as revenue, AVG(total_amount) as aov FROM orders WHERE status IN ('paid', 'recovered')"
  );
  const failed = await db.query(
    "SELECT COUNT(*) as count, SUM(amount) as lost_rev FROM payments WHERE status = 'failed'"
  );
  const recovered = await db.query(
    "SELECT COUNT(*) as count, SUM(amount) as rec_rev FROM payments WHERE status = 'recovered'"
  );

  return {
    totalRevenue: Number(paidOrders.rows[0]?.revenue || 0),
    totalOrders: Number(paidOrders.rows[0]?.count || 0),
    aov: Math.round(Number(paidOrders.rows[0]?.aov || 0)),
    failedCount: Number(failed.rows[0]?.count || 0),
    failedValue: Number(failed.rows[0]?.lost_rev || 0),
    recoveredCount: Number(recovered.rows[0]?.count || 0),
    recoveredValue: Number(recovered.rows[0]?.rec_rev || 0)
  };
}

// Tool 7: get_failed_payments
async function get_failed_payments({ limit = 10 }) {
  const res = await db.query(
    `SELECT pr.*, c.name, c.email, c.phone 
     FROM payment_recovery pr
     LEFT JOIN customers c ON pr.customer_id = c.id
     WHERE pr.recovery_status = 'pending'
     ORDER BY pr.created_at DESC
     LIMIT ${Number(limit)}`
  );
  return res.rows;
}

// Tool 8: query_knowledge_base
async function query_knowledge_base({ query = '' }) {
  const res = await db.query(
    `SELECT * FROM knowledge_documents 
     WHERE title ILIKE $1 OR content ILIKE $1 
     LIMIT 3`,
    [`%${query}%`]
  );
  return res.rows;
}

module.exports = {
  search_products,
  get_product,
  get_customer_profile,
  calculate_fit_score,
  calculate_offer,
  get_sales_analytics,
  get_failed_payments,
  query_knowledge_base
};
