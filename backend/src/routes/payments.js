const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../db');
const { getIO } = require('../utils/socket');
require('dotenv').config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_Shoppilot2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'shoppilot_secret_test_key';

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { order_id, amount, currency = 'INR' } = req.body;
    if (!order_id || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required.' });
    }

    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    // Update transaction with razorpay_order_id
    await db.query(
      'UPDATE transactions SET razorpay_order_id = $1 WHERE order_id = $2',
      [razorpayOrderId, order_id]
    );

    res.json({
      success: true,
      key_id: RAZORPAY_KEY_ID,
      razorpay_order_id: razorpayOrderId,
      amount: Math.round(Number(amount) * 100), // in paise
      currency: currency,
      name: 'ShopPilot AI Commerce',
      description: `Payment for Order #${order_id}`
    });
  } catch (err) {
    console.error('Payment order creation error:', err.message);
    res.status(500).json({ error: 'Failed to initiate payment gateway.' });
  }
});

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // Verify HMAC-SHA256 signature if real credentials provided, or allow simulated signatures
    let isValid = false;
    if (razorpay_signature && razorpay_signature.startsWith('sim_')) {
      isValid = true;
    } else if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      isValid = generatedSignature === razorpay_signature;
    } else {
      // In sandbox/test mode without signature, accept verified payment
      isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' });
    }

    const paymentId = razorpay_payment_id || `pay_${Date.now()}`;

    // Update order status to paid
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', order_id]);
    await db.query(
      'UPDATE transactions SET status = $1, razorpay_payment_id = $2 WHERE order_id = $3',
      ['captured', paymentId, order_id]
    );

    // Fetch order to record in payments
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    const order = orderRes.rows[0];

    if (order) {
      await db.query(
        `INSERT INTO payments (id, payment_id, order_id, customer_id, razorpay_payment_id, amount, status, payment_method, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          `pay_rec_${Date.now()}`,
          paymentId,
          order_id,
          order.customer_id,
          paymentId,
          order.total_amount,
          'captured',
          'UPI',
          new Date().toISOString()
        ]
      );

      // Customer behavioral telemetry
      await db.query(
        `INSERT INTO customer_events (id, customer_id, session_id, event_type, payload, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          `evt_pay_${Date.now()}`,
          order.customer_id,
          `sess_${order.customer_id}`,
          'payment_success',
          JSON.stringify({ order_id, amount: order.total_amount }),
          new Date().toISOString()
        ]
      );
    }

    // Broadcast live telemetry via WebSockets
    const io = getIO();
    if (io) {
      io.emit('payment_captured', {
        order_id,
        payment_id: paymentId,
        amount: order?.total_amount,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and captured successfully',
      order_id,
      payment_id: paymentId,
      status: 'paid'
    });
  } catch (err) {
    console.error('Payment verification error:', err.message);
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

// POST /api/payments/simulate-result (For instant Demo Scenarios: Success or Failure Recovery)
router.post('/simulate-result', async (req, res) => {
  try {
    const { order_id, outcome, failure_reason } = req.body; // outcome: 'SUCCESS' or 'FAILED'
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [order_id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRes.rows[0];
    const paymentId = `pay_sim_${Date.now()}`;
    const io = getIO();

    if (outcome === 'SUCCESS') {
      await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['paid', order_id]);
      await db.query(
        'UPDATE transactions SET status = $1, razorpay_payment_id = $2 WHERE order_id = $3',
        ['captured', paymentId, order_id]
      );
      await db.query(
        `INSERT INTO payments (id, payment_id, order_id, customer_id, razorpay_payment_id, amount, status, payment_method, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [`pay_${Date.now()}`, paymentId, order_id, order.customer_id, paymentId, order.total_amount, 'captured', 'UPI', new Date().toISOString()]
      );

      if (io) {
        io.emit('payment_captured', { order_id, amount: order.total_amount, payment_id: paymentId });
      }

      return res.json({ success: true, status: 'paid', payment_id: paymentId });
    } else {
      // Payment Failed Scenario -> Trigger Recovery Protocol
      const reason = failure_reason || 'Bank server timeout during UPI verification';
      await db.query('UPDATE orders SET status = $1 WHERE id = $2', ['failed', order_id]);
      await db.query(
        'UPDATE transactions SET status = $1, failure_reason = $2 WHERE order_id = $3',
        ['failed', reason, order_id]
      );
      await db.query(
        `INSERT INTO payments (id, payment_id, order_id, customer_id, razorpay_payment_id, amount, status, payment_method, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [`pay_${Date.now()}`, paymentId, order_id, order.customer_id, paymentId, order.total_amount, 'failed', 'UPI', new Date().toISOString()]
      );

      // Create Payment Recovery Record
      const recId = `rec_${order_id}`;
      await db.query(
        `INSERT INTO payment_recovery (id, order_id, customer_id, amount, failure_reason, recovery_strategy, recovery_status, recovery_action_note, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          recId,
          order_id,
          order.customer_id,
          order.total_amount,
          reason,
          'AI Nudge with Alternate Payment Method (Auto Netbanking/Card Switch)',
          'pending',
          'High purchase intent detected. Recommending card or alternate bank rail with 0% margin discount.',
          new Date().toISOString()
        ]
      );

      if (io) {
        io.emit('payment_failed', {
          order_id,
          amount: order.total_amount,
          reason,
          recovery_id: recId
        });
      }

      return res.json({
        success: false,
        status: 'failed',
        reason,
        recovery_id: recId,
        recommended_action: 'Switch to Netbanking or Credit/Debit Card. No discount required.'
      });
    }
  } catch (err) {
    console.error('Simulation error:', err.message);
    res.status(500).json({ error: 'Payment simulation failed' });
  }
});

// GET /api/payments (List payment logs)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let whereClause = '';
    let params = [];
    if (status) {
      whereClause = 'WHERE status = $1';
      params.push(status);
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sql = `SELECT * FROM payments ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const result = await db.query(sql, params);
    res.json({ payments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
