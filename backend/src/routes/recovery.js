const express = require('express');
const router = express.Router();
const db = require('../../db');
const { getIO } = require('../utils/socket');

// GET /api/recovery/failed (List failed payments eligible for recovery)
router.get('/failed', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT pr.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, o.total_amount
       FROM payment_recovery pr
       LEFT JOIN customers c ON pr.customer_id = c.id
       LEFT JOIN orders o ON pr.order_id = o.id
       ORDER BY pr.created_at DESC
       LIMIT 50`
    );

    const pendingCountRes = await db.query("SELECT COUNT(*) as count, SUM(amount) as val FROM payment_recovery WHERE recovery_status = 'pending'");
    const recoveredCountRes = await db.query("SELECT COUNT(*) as count, SUM(amount) as val FROM payment_recovery WHERE recovery_status = 'recovered'");

    res.json({
      recoveries: result.rows,
      summary: {
        pendingRecoveries: Number(pendingCountRes.rows[0]?.count || 0),
        pendingRecoverableAmount: Number(pendingCountRes.rows[0]?.val || 0),
        recoveredCount: Number(recoveredCountRes.rows[0]?.count || 0),
        recoveredAmount: Number(recoveredCountRes.rows[0]?.val || 0)
      }
    });
  } catch (err) {
    console.error('Fetch recovery error:', err.message);
    res.status(500).json({ error: 'Failed to fetch failed payment recoveries' });
  }
});

// POST /api/recovery/:id/retry (Customer retries payment via recovery prompt)
router.post('/:id/retry', async (req, res) => {
  try {
    const { id } = req.params;
    const { recoveryMethod = 'Netbanking' } = req.body;

    const recoveryRes = await db.query('SELECT * FROM payment_recovery WHERE id = $1', [id]);
    if (recoveryRes.rows.length === 0) {
      return res.status(404).json({ error: 'Recovery record not found' });
    }

    const rec = recoveryRes.rows[0];

    // Mark recovery successful
    await db.query(
      `UPDATE payment_recovery 
       SET recovery_status = 'recovered', 
           recovery_action_note = $1, 
           recovered_at = $2 
       WHERE id = $3`,
      [
        `Customer successfully completed payment via ${recoveryMethod} after AI smart recovery link.`,
        new Date().toISOString(),
        id
      ]
    );

    // Update order status to recovered
    await db.query("UPDATE orders SET status = 'recovered' WHERE id = $1", [rec.order_id]);

    // Update payment record to recovered
    await db.query(
      "UPDATE payments SET status = 'recovered', payment_method = $1 WHERE order_id = $2",
      [recoveryMethod, rec.order_id]
    );

    // Broadcast update via WebSockets
    const io = getIO();
    if (io) {
      io.emit('recovery_success', {
        recovery_id: id,
        order_id: rec.order_id,
        amount: rec.amount,
        method: recoveryMethod,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Payment recovered successfully!',
      recovery_id: id,
      order_id: rec.order_id,
      amount: rec.amount,
      status: 'recovered'
    });
  } catch (err) {
    console.error('Recovery retry error:', err.message);
    res.status(500).json({ error: 'Failed to process payment recovery retry' });
  }
});

module.exports = router;
