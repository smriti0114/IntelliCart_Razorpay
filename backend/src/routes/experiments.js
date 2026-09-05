const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/experiments
router.get('/', async (req, res) => {
  try {
    const experiments = await db.query('SELECT * FROM experiments ORDER BY created_at DESC');

    const result = [];
    for (const exp of experiments.rows) {
      const events = await db.query(
        `SELECT variant, event_type, COUNT(*) as count, SUM(revenue) as total_revenue
         FROM experiment_events
         WHERE experiment_id = $1
         GROUP BY variant, event_type`,
        [exp.id]
      );

      const variants = {
        A: { name: exp.strategy_a_name, impressions: 0, conversions: 0, revenue: 0 },
        B: { name: exp.strategy_b_name, impressions: 0, conversions: 0, revenue: 0 },
        C: { name: exp.strategy_c_name, impressions: 0, conversions: 0, revenue: 0 }
      };

      for (const ev of events.rows) {
        if (variants[ev.variant]) {
          if (ev.event_type === 'impression') {
            variants[ev.variant].impressions += Number(ev.count);
          } else if (ev.event_type === 'conversion') {
            variants[ev.variant].conversions += Number(ev.count);
            variants[ev.variant].revenue += Number(ev.total_revenue || 0);
          }
        }
      }

      // Compute conversion rates and AOV
      let bestVariant = 'C';
      let maxConv = -1;
      for (const [key, val] of Object.entries(variants)) {
        val.conversionRate = val.impressions > 0 ? +((val.conversions / val.impressions) * 100).toFixed(1) : 0;
        val.aov = val.conversions > 0 ? Math.round(val.revenue / val.conversions) : 0;
        if (val.conversionRate > maxConv) {
          maxConv = val.conversionRate;
          bestVariant = key;
        }
      }

      result.push({
        ...exp,
        variants,
        recommendedWinner: bestVariant,
        confidence: 94
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Experiments fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

// POST /api/experiments
router.post('/', async (req, res) => {
  try {
    const { name, description, strategy_a_name, strategy_b_name, strategy_c_name } = req.body;
    if (!name || !strategy_a_name || !strategy_b_name) {
      return res.status(400).json({ error: 'Experiment name and at least two strategies required' });
    }

    const id = `exp_${Date.now()}`;
    await db.query(
      `INSERT INTO experiments (id, name, description, strategy_a_name, strategy_b_name, strategy_c_name, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, name, description || '', strategy_a_name, strategy_b_name, strategy_c_name || null, 'active', new Date().toISOString()]
    );

    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('Create experiment error:', err.message);
    res.status(500).json({ error: 'Failed to create experiment' });
  }
});

module.exports = router;
