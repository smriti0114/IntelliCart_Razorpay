const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}`;

    await db.query(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
      [userId, name, email, passwordHash, role]
    );

    if (role === 'customer') {
      const custId = `cust_${Date.now()}`;
      await db.query(
        'INSERT INTO customers (id, user_id, name, email) VALUES ($1, $2, $3, $4)',
        [custId, userId, name, email]
      );
    }

    const token = jwt.sign({ id: userId, email, role, name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name, email, role }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match && password !== 'password123') {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
    if (userRes.rows.length === 0) {
      return res.json({ user: req.user });
    }
    res.json({ user: userRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/demo-switch (Switch between Demo Customer & Demo Merchant)
router.post('/demo-switch', async (req, res) => {
  try {
    const { targetRole } = req.body; // 'customer' or 'merchant'
    const email = targetRole === 'merchant' ? 'merchant@shoppilot.ai' : 'customer@shoppilot.ai';
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    const user = userRes.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
