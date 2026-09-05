# ShopPilot AI — System Architecture

## 1. High-Level Architecture

ShopPilot AI is designed as a modular, decoupled agentic commerce platform where AI agents **do not directly access the database**, but instead interact through strictly controlled, validated backend tools and an explicit safety trust layer.

```
+-------------------------------------------------------------------------+
|                  ShopPilot AI Frontend (Next.js / React)                |
|  - Customer Storefront & Conversational AI Shopping Copilot             |
|  - Merchant Executive Growth Console & Revenue Simulator                |
+------------------------------------+------------------------------------+
                                     | (REST & WebSockets)
                                     v
+-------------------------------------------------------------------------+
|                    Backend API Engine (Node.js / Express)               |
|  - JWT Authentication & RBAC Guard                                      |
|  - Financial Payments & Razorpay Webhook Management                     |
|  - Live WebSockets Telemetry Stream                                     |
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
|  (500+ Cust, 110+ |      |  (Model A & B)    |      |  Sandbox Sandbox  |
|   Products, 2100+ |      |  Precision: 0.972 |      |  Auto Recovery    |
|   Txns)           |      |  ROC-AUC: 0.986   |      |  Signature Verify |
+-------------------+      +-------------------+      +-------------------+
```

---

## 2. The 7-Stage Agentic Commerce Loop

The core differentiator of ShopPilot AI is that it does not behave like a generic conversational chatbot. Every request executes a rigorous 7-stage cognitive cycle:

1. **Observe**: Ingests natural-language customer requirements, session parameters, and historical RFM profile metrics (Recency, Frequency, Monetary spend).
2. **Analyze**: Extracts intent, budget ceiling, primary use case (e.g. coding, gaming, office work), and technical specifications via Google Gemini 2.5 Flash with deterministic fallback.
3. **Reason**: Executes multi-dimensional fit scoring across candidate catalog products:
   - **Budget Fit (35% weight)**: Normalized distance to budget ceiling.
   - **Use Case Fit (35% weight)**: Semantic and hardware alignment (RTX GPU, RAM, thermals).
   - **Customer Fit (15% weight)**: Historical brand and category affinity.
   - **Rating Fit (15% weight)**: Verified buyer ratings and reviews.
   - **Overall Fit**: Composite score with complementary accessory pairing.
4. **Decide**: The **AI Offer Agent** calculates purchase probability via Scikit-learn Model A. If intent is high (>75%), it strictly issues **NO DISCOUNT**, preserving merchant margin. Only moderate/low-intent customers receive targeted incentives (5–10%), with a hard ceiling of 15%.
5. **Take Action**: Logs structured decision payload to the audit database, broadcasts live telemetry to the Merchant Console via WebSockets, and renders rich interactive product recommendations.
6. **Measure**: Tracks order creation, Razorpay payment verification, and webhook results.
7. **Learn**: Updates customer RFM parameters, logs failed payment recovery events, and queues data for model retraining.

---

## 3. Safety & Trust Layer (Rule 18 Compliance)

Before high-impact AI actions are executed (e.g. launching payment recovery campaigns, issuing automated bundles, or modifying campaign rules), they pass through the **Safety & Trust Layer**:
- Proposals are persisted in `ai_actions` with status `PENDING`.
- Merchants inspect the expected financial impact, confidence score, and rationale on the **Autonomous AI Growth Console**.
- Merchants click `[Approve]` or `[Reject]`.
- Approved actions execute safely through controlled tool handlers.
