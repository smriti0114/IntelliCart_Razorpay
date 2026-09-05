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
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

describe('JWT Middleware', () => {
  it('should block requests without a token', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Access token required');
  });

  it('should allow requests with a valid token', async () => {
    const token = jwt.sign({ username: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Access granted');
  });
});
