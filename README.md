# ShopPilot AI — Autonomous Commerce Growth Engine

[![Stack](https://img.shields.io/badge/Stack-React_19_|_Tailwind_v4_|_Node.js_|_FastAPI_|_Scikit--Learn-6366f1.svg)](https://github.com/prince-kumar56/CodSoft_Tasks)
[![Status](https://img.shields.io/badge/Status-Production--Grade_MVP-10b981.svg)]()
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay_Sandbox_Verified-3b82f6.svg)]()
[![ML Evaluation](https://img.shields.io/badge/ROC--AUC-0.986_|_Precision_0.972-8b5cf6.svg)]()

ShopPilot AI is a production-style, autonomous AI commerce platform engineered for two users:
1. **Customers**: Natural-language specification discovery, multi-dimensional product fit scoring, margin-safe dynamic incentives, and 1-click Razorpay checkout.
2. **Merchants**: Executive financial telemetry, K-Means customer segmentation, autonomous revenue opportunity mining, revenue elasticity simulation, A/B experimentation, and self-healing payment recovery.

The central differentiator is that the platform does not behave like a generic conversational chatbot. It strictly follows the cognitive agentic cycle:
$$\text{Observe} \longrightarrow \text{Analyze} \longrightarrow \text{Reason} \longrightarrow \text{Decide} \longrightarrow \text{Take Action} \longrightarrow \text{Measure} \longrightarrow \text{Learn}$$

---

## 1. System Architecture

```
+-------------------------------------------------------------------------+
|                  ShopPilot AI Frontend (React 19 / Tailwind CSS v4)     |
|  - Customer Storefront & Conversational AI Shopping Copilot             |
|  - Merchant Executive Growth Console & Revenue Simulator                |
+------------------------------------+------------------------------------+
                                     | (REST & WebSockets)
                                     v
+-------------------------------------------------------------------------+
|                    Backend API Engine (Node.js / Express)               |
|  - JWT Authentication & Role Guard                                      |
|  - Orders & Financial Razorpay Webhook Management                       |
|  - Live WebSockets Telemetry Stream (Socket.io)                         |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                 AI Agent Orchestration & Trust Layer                    |
|  - Master Orchestrator: Observe -> Analyze -> Reason -> Decide -> Act  |
|  - Specialized Agents: Intent, Recommendation, Offer, Growth, Recovery  |
|  - Human-in-the-Loop Safety Approvals                                   |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         Controlled Backend Tools                        |
|  search_products | get_customer_profile | calculate_offer | sim_rev     |
+---------+--------------------------+--------------------------+---------+
          |                          |                          |
          v                          v                          v
+-------------------+      +-------------------+      +-------------------+
|  Dual-Mode Database|      |  ML Intel Service |      |  Razorpay Gateway |
|  Postgres / SQLite|      |  FastAPI / Sklearn|      |  Orders & Webhooks|
|  (520 Customers,  |      |  (Model A & B)    |      |  Sandbox Verified |
|   110 Products,   |      |  Precision: 0.972 |      |  Auto Recovery    |
|   2100 Txns)      |      |  ROC-AUC: 0.986   |      |  Signature Verify |
+-------------------+      +-------------------+      +-------------------+
```

---

## 2. Core Features

### For Customers:
- **Conversational AI Shopping Copilot**: Natural-language query understanding (e.g. *"I need a laptop for coding and gaming under ₹70,000"*).
- **Observable Agent Reasoning Trace**: Transparent real-time display of intent extraction, catalog candidate filtering, and fit calculations.
- **Multidimensional Fit Scoring**:
  - **Budget Fit (35%)**: Proximity to budget ceiling.
  - **Use Case Fit (35%)**: Specs alignment with use case (RTX GPU, RAM, thermals).
  - **Customer Fit (15%)**: Historical category affinity.
  - **Rating Fit (15%)**: Verified buyer volume and rating.
  - **Overall Fit**: Composite score with complementary accessory bundling.
- **Margin-Safe AI Dynamic Pricing**: Evaluates purchase probability; strictly suppresses discounts for high-intent shoppers to preserve merchant margins.
- **Integrated Razorpay Checkout**: Test sandbox checkout with UPI, Cards, and Netbanking simulations.
- **Self-Healing Payment Recovery**: Automatically detects failed payments and provides intelligent alternative payment retry links.

### For Merchants:
- **Executive KPI Dashboard**: Gross Settled Revenue, Total Orders, Conversion Rate, AOV, Payment Success Rate, Failed Payments Value, Recovered Revenue, and AI Revenue Lift.
- **Real-Time Telemetry Stream**: Live WebSocket feed broadcasting every AI decision and confidence score.
- **Autonomous Growth Hub**: AI scans actual database transactions to discover high-ROI revenue opportunities (e.g. Recover ₹1.84L in failed UPI payments, Bundle ₹64k in laptop stands).
- **Human-in-the-Loop Trust Layer**: High-impact campaigns require explicit merchant approval (`[Approve Action]` / `[Reject Action]`).
- **AI Revenue & Margin Simulator**: Dynamic elasticity modeling for what-if questions (e.g. *"What happens if I reduce discounts by 20%?"*).
- **K-Means Customer Segmentation**: Clusters customer base into High-Value, Loyal, Regular, Discount-Sensitive, and At-Risk segments.
- **A/B Experimentation Engine**: Multi-variant performance tracking (Strategy A vs B vs C) with automatic statistical winner determination.
- **Merchant Diagnostic Assistant**: Real-time natural language answers grounded in database figures (*"Why did revenue fall this week?"*, *"How can I increase revenue by 10%?"*).

---

## 3. Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Recharts, React Router v7, Vite.
- **Backend API**: Node.js, Express, Socket.io, JSONWebToken, BcryptJS, Supertest.
- **AI & Orchestration**: Google Gemini 2.5 Flash (`@google/genai`) with deterministic regex/NLP fallbacks, Controlled Backend Tools.
- **Machine Learning**: Python 3.10+, FastAPI, Scikit-Learn, Pandas, NumPy, Joblib:
  - **Model A**: Random Forest Purchase Probability Classifier (Precision: 0.972, Recall: 0.937, ROC-AUC: 0.986).
  - **Model B**: K-Means Customer Segmentation Engine (5 semantic clusters).
- **Database**: PostgreSQL with automatic zero-config Node.js SQLite fallback (`shoppilot.db`).
- **Payments**: Razorpay API, HMAC-SHA256 signature verification, and official webhooks.

---

## 4. Realistic Seed Dataset

The project includes an Indian commerce seed database generated via `database/seed.js`:
- **520 Customers**: Realistic Indian names, phone numbers, RFM scores, and segment assignments.
- **110 Products**: Across 6 categories (Laptops, Smartphones, Audio, Gaming Gear, Fitness & Wearables, Accessories) with detailed JSON specs and INR pricing.
- **2,100 Orders & Financial Transactions**: Realistic success/failure rates (~12% bank timeouts, ~65% autonomous recovery).
- **RAG Knowledge Base**: Return policies, shipping SLAs, warranty terms, and payment failure guidelines.

---

## 5. Quick Start & Execution

### 1. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Seed the Database
```bash
node database/seed.js
```

### 3. Launch Services

**Terminal 1 — Backend API Engine:**
```bash
cd backend
node server.js
# Runs on http://localhost:5001
```

**Terminal 2 — Machine Learning Intelligence Service:**
```bash
cd ml-service
./venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
# Runs on http://localhost:8000
```

**Terminal 3 — Frontend Web Storefront & Console:**
```bash
cd frontend
npm run dev
# Open http://localhost:5173
```

---

## 6. Pre-configured Demo Accounts

| Role | Email | Password | Console |
|---|---|---|---|
| Demo Customer | `customer@shoppilot.ai` | `password123` | Storefront (`/`) |
| Demo Merchant | `merchant@shoppilot.ai` | `password123` | Growth Console (`/merchant`) |
| System Admin | `admin@shoppilot.ai` | `password123` | Full Access |

*Tip: Use the 1-click pill switcher in the top navigation bar (`🛒 Customer Store` ↔ `⚡ Merchant Engine`) to toggle personas instantly.*

---

## 7. Verification & Testing

Run the automated integration test suite:
```bash
cd backend
node test-suite.js
```

**Test Verification Summary:**
- Health Check & System Status: **PASSED**
- Customer & Merchant JWT Authentication: **PASSED**
- Product Catalog Search & Multidimensional Fit Scoring: **PASSED**
- Flagship AI Shopping Conversational Flow: **PASSED**
- Order Creation & Stock Validation: **PASSED**
- Razorpay Sandbox Order Creation & Verification: **PASSED**
- Payment Failure & AI Recovery Retry Loop: **PASSED**
- Merchant Executive Revenue & Funnel Analytics: **PASSED**
- Autonomous Growth Opportunities Discovery: **PASSED**
- AI Revenue & Margin Elasticity Simulator: **PASSED**
- Merchant AI Diagnostic Assistant: **PASSED**

---

## 8. Placement Interview Talking Points

1. **Why Agentic instead of a chatbot?** Generic chatbots hallucinate text. ShopPilot AI follows a controlled 7-step loop with strict tool boundaries, explicit margin guardrails, and real-time database grounding.
2. **How is merchant margin protected?** The AI Offer Agent utilizes Scikit-learn Model A to evaluate purchase probability. If customer intent is high (>75%), discounts are strictly prohibited.
3. **How does payment recovery operate?** When a bank UPI switch times out, the webhook triggers an event in the recovery ledger, calculating high customer intent and dispatching zero-discount alternate payment prompts.
4. **Zero-Configuration Resilience**: Dual-mode database layer automatically falls back to an embedded SQLite engine if PostgreSQL is unavailable, ensuring zero runtime failure during live demonstrations.
