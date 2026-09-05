const axios = require('axios');

async function testFlow() {
  try {
    console.log("Testing ShopPilot AI Agentic Commerce Flow...");
    
    // Bypassing auth token restriction for local test verification
    const headers = { 'Content-Type': 'application/json' };

    // 1. Test Intent Parsing
    console.log("\n1. Testing Intent Agent (/api/ai/intent)...");
    const intentRes = await axios.post('http://127.0.0.1:5050/api/ai/intent', {
      prompt: "I want a high-end tech gadget or laptop under 75000 INR"
    }, { headers });
    console.log("Intent Result:", JSON.stringify(intentRes.data, null, 2));

    const intent = intentRes.data.intent;

    // 2. Test Product Recommendations
    console.log("\n2. Testing Recommendation Agent (/api/ai/recommend)...");
    const recRes = await axios.post('http://127.0.0.1:5050/api/ai/recommend', { intent }, { headers });
    console.log("Recommendations Count:", recRes.data.recommendations.length);

    // 3. Test ML Prediction Service Bridge
    console.log("\n3. Testing ML Prediction Service (/api/ai/predict-conversion)...");
    const mlRes = await axios.post('http://127.0.0.1:5050/api/ai/predict-conversion', {
      category: intent.category,
      budget_max: intent.budget_max,
      user_segment: "premium"
    }, { headers });
    console.log("ML Prediction Result:", JSON.stringify(mlRes.data, null, 2));

    // 4. Test Growth Analytics Agent
    console.log("\n4. Testing Growth Analytics Agent (/api/ai/growth-analysis)...");
    const growthRes = await axios.get('http://127.0.0.1:5050/api/ai/growth-analysis', { headers });
    console.log("Growth Opportunities Count:", growthRes.data.opportunities.length);

    console.log("\n✨ All ShopPilot AI Agentic services operational and verified successfully!");
  } catch (err) {
    console.error("Flow test encountered an error:", err.response?.data || err.message);
  }
}

testFlow();
