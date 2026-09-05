# ShopPilot AI — Setup & Local Execution Guide

## Prerequisites
- Node.js v18+ (Node v22 recommended)
- Python 3.10+
- PostgreSQL (Optional: ShopPilot AI includes a built-in zero-config SQLite engine that runs seamlessly without external database servers)

---

## 1. Quick Start (Zero-Config)

### Step 1: Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Step 2: Seed Database
Populate 500+ realistic customers, 110+ products, and 2,100+ transactions:
```bash
node database/seed.js
```

### Step 3: Start Services
In separate terminal windows:

**Terminal 1 (Backend API Engine):**
```bash
cd backend
node server.js
# Runs on http://localhost:5001
```

**Terminal 2 (Machine Learning Service):**
```bash
cd ml-service
./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
# Runs on http://localhost:8000
```

**Terminal 3 (Frontend Web App):**
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## 2. Pre-configured Demo Accounts

| Role | Email | Password |
|---|---|---|
| Demo Customer | `customer@shoppilot.ai` | `password123` |
| Demo Merchant | `merchant@shoppilot.ai` | `password123` |
| System Admin | `admin@shoppilot.ai` | `password123` |

*Note: You can seamlessly switch between Customer Storefront and Merchant Engine in 1 click using the pill toggle in the top navigation bar.*
