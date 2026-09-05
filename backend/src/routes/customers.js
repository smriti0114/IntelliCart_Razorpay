const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const { segment, search, limit = 50, page = 1 } = req.query;
    let conditions = [];
    let params = [];
    let pIdx = 1;

    if (segment && segment !== 'All') {
      conditions.push(`segment = $${pIdx++}`);
      params.push(segment);
    }

    if (search) {
      conditions.push(`(name ILIKE $${pIdx} OR email ILIKE $${pIdx} OR phone ILIKE $${pIdx})`);
      params.push(`%${search}%`);
      pIdx++;
    }

    const whereStr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const querySql = `SELECT * FROM customers ${whereStr} ORDER BY rfm_monetary DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const result = await db.query(querySql, params);

    const countSql = `SELECT COUNT(*) as total FROM customers ${whereStr}`;
    const countRes = await db.query(countSql, params);

    res.json({
      customers: result.rows,
      total: Number(countRes.rows[0]?.total || result.rows.length),
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Customers fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id/history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const ordersRes = await db.query('SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC', [id]);
    const eventsRes = await db.query('SELECT * FROM customer_events WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 20', [id]);

    res.json({
      orders: ordersRes.rows,
      recentEvents: eventsRes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
