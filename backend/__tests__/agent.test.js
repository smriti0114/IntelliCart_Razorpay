const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'test_secret';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.post('/api/agent/decide-discount', verifyToken, (req, res) => {
  const { customer_id, cart_amount } = req.body;
  if (!customer_id || cart_amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.json({
    message: 'Decision logged successfully',
    discount_percentage: cart_amount > 4000 ? 10 : 0,
    confidence_score: 0.85,
    status: 'AUTO_EXECUTED'
  });
});

describe('Agent Discount Endpoint', () => {
  it('should require authentication to evaluate discount', async () => {
    const res = await request(app)
      .post('/api/agent/decide-discount')
      .send({ customer_id: 'C001', cart_amount: 4500 });
    expect(res.statusCode).toEqual(401);
  });

  it('should successfully return a discount decision with a valid token', async () => {
    const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .post('/api/agent/decide-discount')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer_id: 'C001', cart_amount: 4500 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'AUTO_EXECUTED');
    expect(res.body).toHaveProperty('discount_percentage');
  });
});
