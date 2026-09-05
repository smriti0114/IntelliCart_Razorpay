const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const { setIO } = require('./src/utils/socket');

// Route Imports
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const paymentRoutes = require('./src/routes/payments');
const analyticsRoutes = require('./src/routes/analytics');
const recoveryRoutes = require('./src/routes/recovery');
const experimentRoutes = require('./src/routes/experiments');
const customerRoutes = require('./src/routes/customers');
const aiRoutes = require('./src/routes/ai');

const app = express();
const server = http.createServer(app);

// WebSockets for Real-Time Merchant Telemetry
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
setIO(io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected to live telemetry stream: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  if (req.path !== '/health') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Root & Health Checks
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'ShopPilot AI — Backend API & WebSockets Engine',
    port: 5001,
    health: '/health',
    websockets: 'active (ws://localhost:5001)',
    db_mode: db.getMode(),
    api_routes: [
      '/api/auth',
      '/api/products',
      '/api/orders',
      '/api/payments',
      '/api/analytics',
      '/api/recovery',
      '/api/experiments',
      '/api/customers',
      '/api/ai'
    ],
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ShopPilot AI Node Backend Active',
    db_mode: db.getMode(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', (req, res, next) => {
  // Shortcut to products/categories
  req.url = '/categories';
  productRoutes(req, res, next);
});
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/experiments', experimentRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/ai', aiRoutes);

// Backward Compatibility Audit Logs & Discount Endpoints
app.get('/api/audit-logs', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM agent_decisions ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

app.post('/api/agent/decide-discount', async (req, res) => {
  try {
    const { customer_id, cart_amount, aov, previous_orders } = req.body;
    const { evaluateOffer } = require('./src/agents/offerAgent');

    const offer = await evaluateOffer({
      customer_id: customer_id || 'cust_0001',
      cart_amount: cart_amount || 4500,
      purchase_probability: 0.82
    });

    const decisionId = `dec_${Date.now()}`;
    await db.query(
      `INSERT INTO agent_decisions (id, session_id, customer_id, decision_type, input_payload, output_payload, confidence_score, status, discount_percentage, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        decisionId,
        'sim_session',
        customer_id || 'cust_0001',
        'DISCOUNT_OFFERED',
        JSON.stringify({ cart_amount, aov, previous_orders }),
        JSON.stringify(offer),
        0.82,
        'AUTO_EXECUTED',
        offer.discount_percentage,
        new Date().toISOString()
      ]
    );

    const newDecision = {
      id: decisionId,
      customer_id,
      cart_amount,
      discount_percentage: offer.discount_percentage,
      confidence_score: 0.82,
      status: 'AUTO_EXECUTED',
      decision: offer.decision,
      reason: offer.reason
    };

    io.emit('telemetry_update', newDecision);
    res.json(newDecision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShopPilot AI Engine active on http://localhost:${PORT}`);
  console.log(`⚡ Connected Database Mode: ${db.getMode()}`);
});

module.exports = { app, server };
