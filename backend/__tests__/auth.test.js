const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const JWT_SECRET = 'test_secret';

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

describe('Auth Endpoints', () => {
  it('should generate a token for valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'anypassword' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wronguser', password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
