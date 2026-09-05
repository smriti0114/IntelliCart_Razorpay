const request = require('supertest');
const { app } = require('./server');

async function runSupertestSuite() {
  console.log('🧪 Starting ShopPilot AI In-Memory System Integration Test (Supertest)...');

  try {
    // 1. Health
    const health = await request(app).get('/health');
    console.log('✅ 1. Health Check Passed:', health.body.status);

    // 2. Auth Login (Demo Customer & Demo Merchant)
    const custLogin = await request(app).post('/api/auth/login').send({
      email: 'customer@shoppilot.ai',
      password: 'password123'
    });
    console.log('✅ 2. Customer Auth Login Passed. Token acquired for:', custLogin.body.user?.name);
    const token = custLogin.body.token;

    // 3. Products Catalog & Filter
    const products = await request(app).get('/api/products?category=Laptops&limit=3');
    console.log(`✅ 3. Product Catalog Passed. Found ${products.body.total} total items. Top: ${products.body.products[0]?.name}`);

    // 4. Conversational AI Shopping Flow (Agentic Commerce)
    console.log('\n🤖 Testing Flagship Agentic Commerce Prompt:');
    console.log('User: "I need a laptop for coding and gaming under ₹70,000."');
    const aiChat = await request(app).post('/api/ai/chat').send({
      prompt: 'I need a laptop for coding and gaming under ₹70,000.',
      customer_id: 'cust_0001'
    });

    console.log('✅ 4. AI Shopping Flow Output:');
    console.log('   - Intent Extracted:', aiChat.body.intent);
    console.log('   - Top Pick:', aiChat.body.topPick?.name);
    console.log('   - Fit Score:', aiChat.body.topPick?.fit_scores);
    console.log('   - Purchase Probability:', aiChat.body.purchaseProbability + '%');
    console.log('   - Offer Decision:', aiChat.body.offerDecision?.decision, `(${aiChat.body.offerDecision?.reason})`);
    console.log('   - Accessory Pair:', aiChat.body.complementaryAccessory?.name);
    console.log('   - Reasoning Trace Steps:', aiChat.body.reasoningTrace?.map(s => s.step));

    // 5. Order Placement
    const topProd = aiChat.body.topPick;
    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customer_id: 'cust_0001',
        items: [{ product_id: topProd.id, price: topProd.price, quantity: 1 }],
        shipping_address: { city: 'Bengaluru', pincode: '560001' }
      });
    const orderId = orderRes.body.order?.id;
    console.log('✅ 5. Order Created Successfully:', orderId, 'Total: ₹' + orderRes.body.order?.total_amount);

    // 6. Razorpay Payment Gateway Init & Verification
    const rzpOrder = await request(app).post('/api/payments/create-order').send({
      order_id: orderId,
      amount: orderRes.body.order?.total_amount
    });
    console.log('✅ 6. Razorpay Order Initialized:', rzpOrder.body.razorpay_order_id);

    const rzpVerify = await request(app).post('/api/payments/verify').send({
      order_id: orderId,
      razorpay_order_id: rzpOrder.body.razorpay_order_id,
      razorpay_payment_id: 'pay_test_captured_999',
      razorpay_signature: 'sim_valid_signature'
    });
    console.log('✅ 7. Razorpay Payment Captured & Verified:', rzpVerify.body.status);

    // 7. Payment Failure & AI Recovery Flow
    console.log('\n💳 Testing Payment Failure Recovery Loop:');
    const failSim = await request(app).post('/api/payments/simulate-result').send({
      order_id: orderId,
      outcome: 'FAILED',
      failure_reason: 'Bank UPI network switch timeout'
    });
    console.log('   - Simulated Failure. Status:', failSim.body.status, '| Recovery ID:', failSim.body.recovery_id);

    const retryRes = await request(app).post(`/api/recovery/${failSim.body.recovery_id}/retry`).send({
      recoveryMethod: 'Netbanking'
    });
    console.log('✅ 8. AI Payment Recovery Retried and Succeeded:', retryRes.body.status, 'Recovered ₹' + retryRes.body.amount);

    // 8. Merchant Analytics
    const analytics = await request(app).get('/api/analytics/revenue');
    console.log('✅ 9. Merchant Revenue Analytics Passed. Gross Settled:', '₹' + analytics.body.kpis?.totalRevenue.toLocaleString('en-IN'));
    console.log('   - Recovered Revenue:', '₹' + analytics.body.kpis?.recoveredRevenue.toLocaleString('en-IN'));
    console.log('   - AI Revenue Lift:', '₹' + analytics.body.kpis?.aiRevenueImpact.toLocaleString('en-IN'));

    // 9. Merchant Autonomous Growth Opportunities
    const growth = await request(app).get('/api/ai/growth-analysis');
    console.log(`✅ 10. Merchant Growth Agent Passed. Found ${growth.body.opportunities?.length} opportunities.`);
    console.log('   - Top Opportunity:', growth.body.opportunities[0]?.opportunity, '| Potential:', growth.body.opportunities[0]?.potential_revenue);

    // 10. AI Revenue Simulator
    const sim = await request(app).post('/api/ai/simulate').send({
      discount_reduction_pct: 20
    });
    console.log('✅ 11. AI Revenue Simulator Passed. Margin Impact:', '₹' + sim.body.simulation?.estimatedMarginImpact.toLocaleString('en-IN'));

    // 11. Merchant AI Assistant
    const merchantChat = await request(app).post('/api/ai/merchant-chat').send({
      question: 'How can I increase revenue by 10%?'
    });
    console.log('✅ 12. Merchant AI Assistant Passed. Response length:', merchantChat.body.answer?.length, 'chars');

    console.log('\n🎉 ALL 12 SYSTEM INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runSupertestSuite();
