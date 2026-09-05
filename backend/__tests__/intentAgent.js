const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.LLM_API_KEY });

async function parseCustomerIntent(userPrompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract commerce intent parameters from this user query: "${userPrompt}". 
      Return a strict JSON object with fields: category, budget_max, use_case, and preferences (array).`,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text());
  } catch (err) {
    console.error('Intent parsing error:', err.message);
    return { category: 'general', budget_max: 50000, use_case: 'general use', preferences: [] };
  }
}

module.exports = { parseCustomerIntent };