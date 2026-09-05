const axios = require('axios');

async function getMLPrediction(category, budgetMax, userSegment = "standard") {
  try {
    const response = await axios.post('http://127.0.0.1:8000/predict', {
      category,
      budget_max: budgetMax,
      user_segment: userSegment
    });
    return response.data;
  } catch (err) {
    console.error('ML Service communication error:', err.message);
    return { success: false, conversion_probability: 0.75, recommended_discount_percent: 5 };
  }
}

module.exports = { getMLPrediction };
