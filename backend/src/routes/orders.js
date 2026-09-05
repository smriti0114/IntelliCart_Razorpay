const express = require('express');
const router = express.Router();
const db = require('../../db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/orders (Create an order)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, shipping_address, applied_coupon, discount_amount = 0 } = req.body;
    const customer_id = req.body.customer_id || 'cust_0001';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    let subtotal = 0;
    for (const item of items) {
      subtotal += Number(item.price || item.unit_price) * (item.quantity || 1);
    }

    const discount = Math.min(Number(discount_amount) || 0, subtotal);
    const totalAmount = Math.max(0, subtotal - discount);

    const orderId = `ord_${Date.now()}`;
    const txnId = `txn_${Date.now()}`;
    const razorpayOrderId = `order_rp_${Math.random().toString(36).substring(2, 10)}`;

    // Create Order
    await db.query(
      `INSERT INTO orders (id, customer_id, total_amount, subtotal_amount, discount_amount, applied_coupon, status, shipping_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        orderId,
        customer_id,
        totalAmount,
        subtotal,
        discount,
        applied_coupon || null,
        'pending',
        JSON.stringify(shipping_address || { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' }),
        new Date().toISOString()
      ]
    );

    // Create Order Items
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const unitPrice = Number(it.price || it.unit_price);
      const qty = it.quantity || 1;
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [`item_${orderId}_${i + 1}`, orderId, it.product_id || it.id, qty, unitPrice, unitPrice * qty]
      );
    }

    // Create Transaction Record
    await db.query(
      `INSERT INTO transactions (id, order_id, customer_id, razorpay_order_id, amount, currency, status, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        txnId,
        orderId,
        customer_id,
        razorpayOrderId,
        totalAmount,
        'INR',
        'created',
        'UPI',
        new Date().toISOString()
      ]
    );

    res.status(201).json({
      success: true,
      order: {
        id: orderId,
        total_amount: totalAmount,
        subtotal_amount: subtotal,
        discount_amount: discount,
        status: 'pending',
        razorpay_order_id: razorpayOrderId,
        currency: 'INR'
      }
    });
  } catch (err) {
    console.error('Order creation error:', err.message);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET /api/orders (List orders)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { customer_id, status, limit = 50, page = 1 } = req.query;
    let conditions = [];
    let params = [];
    let pIdx = 1;

    if (customer_id) {
      conditions.push(`customer_id = $${pIdx++}`);
      params.push(customer_id);
    }

    if (status) {
      conditions.push(`status = $${pIdx++}`);
      params.push(status);
    }

    const whereStr = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const querySql = `SELECT * FROM orders ${whereStr} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const result = await db.query(querySql, params);

    res.json({
      orders: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Fetch orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRes.rows[0];
    const itemsRes = await db.query(
      `SELECT oi.*, p.name as product_name, p.image_url, p.category 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [id]
    );

    const txnRes = await db.query('SELECT * FROM transactions WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1', [id]);

    res.json({
      order,
      items: itemsRes.rows,
      transaction: txnRes.rows[0] || null
    });
  } catch (err) {
    console.error('Order detail error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});

module.exports = router;
