async function getRecommendations(intent, pool) {
  try {
    const category = intent.category || 'general';
    const budgetMax = intent.budget_max || 50000;
    
    const query = `SELECT * FROM products WHERE category ILIKE $1 AND price <= $2 ORDER BY rating DESC LIMIT 5`;
    const result = await pool.query(query, [`%${category}%`, budgetMax]);
    
    if (result.rows.length === 0) {
      const fallback = await pool.query(`SELECT * FROM products ORDER BY rating DESC LIMIT 5`);
      return fallback.rows;
    }
    return result.rows;
  } catch (err) {
    console.error('Recommendation error:', err.message);
    return [];
  }
}

module.exports = { getRecommendations };
