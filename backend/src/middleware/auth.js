const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'shoppilot_jwt_super_secret_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Check if optional or demo fallback
    req.user = { id: 'usr_customer', role: 'customer', email: 'customer@shoppilot.ai' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { id: 'usr_customer', role: 'customer', email: 'customer@shoppilot.ai' };
      return next();
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || (req.user.role !== role && req.user.role !== 'admin')) {
      return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
