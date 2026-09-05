# ShopPilot AI — Specialized Agents & Trust Layer

ShopPilot AI employs specialized, single-responsibility agents coordinated by a master orchestrator:

---

## 1. Customer Intent Agent
- **Purpose**: Understands natural-language customer queries and extracts structured parameters.
- **Model**: Google Gemini 2.5 Flash with fallback heuristic regex/NLP parser.
- **Outputs**:
  ```json
  {
    "category": "Laptops",
    "budget_max": 70000,
    "use_case": "coding and gaming",
    "preferences": ["Dedicated RTX GPU", "16GB RAM"]
  }
  ```

---

## 2. Product Recommendation Agent
- **Purpose**: Queries catalog candidates via controlled backend tools and evaluates a 5-dimension fit score.
- **Fit Scoring Formula**:
  - **Budget Fit (35%)**: Proximity to budget ceiling.
  - **Use Case Fit (35%)**: Semantic match between specifications and customer intent.
  - **Customer Fit (15%)**: Category affinity and historical purchases.
  - **Rating Fit (15%)**: Verified product ratings and volume.
  - **Overall Fit**: Composite score (e.g. 97%).
- **Outputs**: Top-ranked product, fit breakdown, natural-language explanation, and complementary accessory.

---

## 3. AI Offer / Pricing Agent
- **Purpose**: Margin preservation. Refuses blanket discounts when purchase probability is high.
- **Hard Business Rules**:
  - **Purchase Probability >= 75%**: Decision = `NO_DISCOUNT`. Protects merchant margin.
  - **Purchase Probability 45% - 74%**: Decision = `TARGETED_INCENTIVE` (5% or ₹500).
  - **Purchase Probability < 45%**: Decision = `RETENTION_OFFER` (max 10%, hard ceiling 15%).

---

## 4. Payment Recovery Agent
- **Purpose**: Self-healing payment recovery.
- **Flow**:
  1. Detects failed payment webhook (e.g. UPI timeout).
  2. Analyzes customer intent score (typically >90% during checkout).
  3. Recommends frictionless alternate payment rail (e.g. Auto-switch to Netbanking or Cards).
  4. Dispatches smart recovery link with 0% margin discount erosion.
  5. Measures recovery outcome and records recovered revenue in database.

---

## 5. Merchant Growth Agent
- **Purpose**: Autonomously mines actual database transactions to discover actionable revenue opportunities.
- **Outputs**:
  - **Opportunity 1**: Recover failed payments (calculates actual value from DB, e.g. ~₹1.84L).
  - **Opportunity 2**: Laptop + Stand desk bundle upsell (calculates AOV lift).
  - **Opportunity 3**: Re-engage high-value inactive accounts.
  - Includes: Opportunity, Potential Revenue, Reason, Recommended Action, Confidence (%).

---

## 6. Merchant Diagnostic AI Assistant
- **Purpose**: Answers merchant executive questions grounded in actual database metrics.
- **Sample Queries**:
  - *"Why did revenue fall this week?"* -> Breaks down payment failures, checkout abandonment, and accessory attachment rates.
  - *"How can I increase revenue by 10%?"* -> Outlines data-backed 3-pillar strategy to capture target revenue without margin erosion.
