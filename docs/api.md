# ShopPilot AI — REST API Reference

Base URL: `http://localhost:5001/api`

---

## 1. Authentication
- `POST /api/auth/register`: Register user `{ name, email, password, role }`
- `POST /api/auth/login`: Login user `{ email, password }` -> returns `{ token, user }`
- `GET /api/auth/me`: Current session profile
- `POST /api/auth/demo-switch`: 1-click role switcher `{ targetRole: 'customer' | 'merchant' }`

---

## 2. Product Catalog
- `GET /api/products`: Filter products `?category=&search=&minPrice=&maxPrice=&sort=&limit=&page=`
- `GET /api/products/:id`: Get product details, specs, and complementary cross-sells
- `GET /api/categories`: List all categories with descriptions and icons

---

## 3. Orders & Checkout
- `POST /api/orders`: Place order `{ items: [{ product_id, price, quantity }], shipping_address, applied_coupon, discount_amount }`
- `GET /api/orders`: List orders `?customer_id=&status=&limit=&page=`
- `GET /api/orders/:id`: Detailed order breakdown with itemized products

---

## 4. Payments & Razorpay Integration
- `POST /api/payments/create-order`: Initialize Razorpay payment order `{ order_id, amount, currency }`
- `POST /api/payments/verify`: Verify HMAC-SHA256 signature `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id }`
- `POST /api/payments/simulate-result`: Test endpoint to simulate payment result `{ order_id, outcome: 'SUCCESS' | 'FAILED', failure_reason }`
- `POST /api/payments/webhook`: Official Razorpay webhook handler for `payment.captured` and `payment.failed`
- `GET /api/payments`: Financial transactions ledger

---

## 5. AI Agents & Orchestration
- `POST /api/ai/chat`: Conversational Commerce Copilot `{ prompt, customer_id, session_id }`
- `POST /api/ai/intent`: Intent parameter extraction `{ prompt }`
- `POST /api/ai/recommend`: Multidimensional recommendation `{ intent, customer_id }`
- `POST /api/ai/offer`: Margin-safe offer evaluation `{ customer_id, cart_amount, purchase_probability }`
- `GET /api/ai/growth-analysis`: Discovered autonomous revenue opportunities
- `POST /api/ai/merchant-chat`: Merchant Diagnostic Assistant `{ question }`
- `POST /api/ai/simulate`: Revenue & Margin Simulator `{ discount_reduction_pct, price_change_pct }`
- `GET /api/ai/actions`: List pending and executed AI actions
- `POST /api/ai/action/approve`: Approve AI action `{ action_id }`
- `POST /api/ai/action/reject`: Reject AI action `{ action_id }`

---

## 6. Payment Recovery
- `GET /api/recovery/failed`: List failed payments pending recovery
- `POST /api/recovery/:id/retry`: Customer retries payment `{ recoveryMethod: 'Netbanking' }`

---

## 7. Merchant Analytics
- `GET /api/analytics/revenue`: Real-time gross revenue, AOV, recovery revenue, and time series
- `GET /api/analytics/conversion`: Conversion funnel (Views -> Carts -> Checkouts -> Paid)
- `GET /api/analytics/customers`: K-Means segments summary and customer profiles
- `GET /api/analytics/payments`: Settlement stats by payment method and status

---

## 8. Experiments Engine
- `GET /api/experiments`: List active A/B experiments with variant metrics
- `POST /api/experiments`: Create new growth experiment `{ name, strategy_a_name, strategy_b_name, strategy_c_name }`
