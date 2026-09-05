const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

let ai = null;
if (process.env.LLM_API_KEY && process.env.LLM_API_KEY !== 'YOUR_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.LLM_API_KEY });
  } catch (e) {
    console.warn('Gemini API init notice:', e.message);
  }
}

/**
 * Customer Intent Agent: Parses natural language input into structured commerce parameters
 */
async function parseCustomerIntent(userPrompt) {
  if (!userPrompt) {
    return { category: 'Laptops', budget_max: 70000, use_case: 'general use', preferences: [] };
  }

  // 1. Try Gemini API first if configured
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Extract commerce intent parameters from this user query: "${userPrompt}".
        Return a strict JSON object with fields:
        - category: string (one of 'Laptops', 'Smartphones', 'Audio', 'Gaming Gear', 'Fitness & Wearables', 'Accessories')
        - budget_max: number (budget in INR, extract numbers like 70000 or 70k -> 70000, default 70000 if none)
        - use_case: string (e.g. 'coding and gaming', 'running', 'daily work')
        - preferences: array of strings (e.g. ['rtx', '16gb ram', 'anc'])`,
        config: { responseMimeType: 'application/json' }
      });
      const parsed = JSON.parse(response.text);
      return {
        category: parsed.category || 'Laptops',
        budget_max: Number(parsed.budget_max) || 70000,
        use_case: parsed.use_case || 'coding and gaming',
        preferences: Array.isArray(parsed.preferences) ? parsed.preferences : []
      };
    } catch (err) {
      console.warn('Gemini intent extraction fallback:', err.message);
    }
  }

  // 2. High-Precision Local Heuristic Parser (zero-failure fallback)
  const lower = userPrompt.toLowerCase();

  // Category matching
  let category = 'Laptops';
  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('smartphone')) {
    category = 'Smartphones';
  } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('earbud') || lower.includes('mic') || lower.includes('soundbar')) {
    category = 'Audio';
  } else if (lower.includes('keyboard') || lower.includes('mouse') || lower.includes('controller') || lower.includes('gamepad') || lower.includes('gaming gear')) {
    category = 'Gaming Gear';
  } else if (lower.includes('watch') || lower.includes('fitness') || lower.includes('band') || lower.includes('smartwatch')) {
    category = 'Fitness & Wearables';
  } else if (lower.includes('stand') || lower.includes('charger') || lower.includes('dock') || lower.includes('cable') || lower.includes('mat')) {
    category = 'Accessories';
  } else if (lower.includes('laptop') || lower.includes('pc') || lower.includes('macbook') || lower.includes('notebook')) {
    category = 'Laptops';
  }

  // Budget matching (e.g. "under 70,000", "under ₹70000", "below 70k", "under 3000")
  let budget_max = 70000;
  const kMatch = lower.match(/(?:under|below|budget|upto|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*k/);
  const numMatch = lower.match(/(?:under|below|budget|upto|within|around)?\s*(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\d{3,6})/);

  if (kMatch && kMatch[1]) {
    budget_max = parseInt(kMatch[1], 10) * 1000;
  } else if (numMatch && numMatch[1]) {
    const rawNum = numMatch[1].replace(/,/g, '');
    const val = parseInt(rawNum, 10);
    if (val >= 500 && val <= 500000) {
      budget_max = val;
    }
  }

  // Use Case matching
  let use_case = 'general productivity';
  if (lower.includes('coding') && lower.includes('gaming')) {
    use_case = 'coding and gaming';
  } else if (lower.includes('coding') || lower.includes('programming') || lower.includes('development')) {
    use_case = 'coding and software engineering';
  } else if (lower.includes('gaming') || lower.includes('esports')) {
    use_case = 'high-performance gaming';
  } else if (lower.includes('daily') || lower.includes('office') || lower.includes('student')) {
    use_case = 'daily study and office work';
  } else if (lower.includes('running') || lower.includes('gym') || lower.includes('workout')) {
    use_case = 'running and fitness tracking';
  }

  // Preferences extraction
  const preferences = [];
  if (lower.includes('rtx') || lower.includes('nvidia')) preferences.push('Dedicated RTX GPU');
  if (lower.includes('16gb') || lower.includes('32gb')) preferences.push('High RAM');
  if (lower.includes('oled') || lower.includes('144hz') || lower.includes('165hz')) preferences.push('High refresh display');
  if (lower.includes('anc') || lower.includes('noise cancelling')) preferences.push('Active Noise Cancellation');
  if (lower.includes('lightweight') || lower.includes('battery')) preferences.push('Long battery life & portability');

  return {
    category,
    budget_max,
    use_case,
    preferences
  };
}

module.exports = { parseCustomerIntent };
