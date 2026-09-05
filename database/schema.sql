-- ==============================================================================
-- ShopPilot AI — Master Database Schema
-- ==============================================================================

-- 1. Users Table (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Merchants Profile
CREATE TABLE IF NOT EXISTS merchants (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    store_name VARCHAR(255) NOT NULL,
    store_currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customers Profile & Intelligence Metrics
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    rfm_recency INT DEFAULT 0,
    rfm_frequency INT DEFAULT 0,
    rfm_monetary NUMERIC(12, 2) DEFAULT 0.00,
    aov NUMERIC(10, 2) DEFAULT 0.00,
    clv NUMERIC(12, 2) DEFAULT 0.00,
    segment VARCHAR(50) DEFAULT 'Regular',
    discount_sensitivity VARCHAR(50) DEFAULT 'Medium',
    preferred_category VARCHAR(100) DEFAULT 'Laptops',
    preferred_payment_method VARCHAR(50) DEFAULT 'UPI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 4.50,
    reviews_count INT DEFAULT 0,
    stock INT DEFAULT 50,
    is_available BOOLEAN DEFAULT 1,
    specs TEXT DEFAULT '{}',
    image_url TEXT,
    tags TEXT DEFAULT '[]',
    popularity_score NUMERIC(5, 2) DEFAULT 50.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Customer Orders
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    total_amount NUMERIC(10, 2) NOT NULL,
    subtotal_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    applied_coupon VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100),
    product_id VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payment Transactions & Razorpay Integration
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100),
    customer_id VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(100) PRIMARY KEY,
    payment_id VARCHAR(100),
    order_id VARCHAR(100),
    customer_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Customer Behavioral Events
CREATE TABLE IF NOT EXISTS customer_events (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    session_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Customer Segments Definition & Analytics
CREATE TABLE IF NOT EXISTS customer_segments (
    id VARCHAR(100) PRIMARY KEY,
    segment_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    customer_count INT DEFAULT 0,
    avg_aov NUMERIC(10, 2) DEFAULT 0.00,
    total_revenue NUMERIC(12, 2) DEFAULT 0.00,
    discount_sensitivity VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. AI Product Recommendations History
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(100) PRIMARY KEY,
    session_id VARCHAR(100),
    customer_id VARCHAR(100),
    product_id VARCHAR(100),
    overall_fit INT NOT NULL,
    budget_fit INT NOT NULL,
    use_case_fit INT NOT NULL,
    customer_fit INT NOT NULL,
    rating_fit INT NOT NULL,
    reason TEXT NOT NULL,
    complementary_product_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Dynamic AI Offers & Incentives
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    discount_pct INT NOT NULL,
    max_discount_amount NUMERIC(10, 2),
    purchase_probability NUMERIC(5, 4),
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'offered',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. AI Decisions Ledger (Telemetry & Audit)
CREATE TABLE IF NOT EXISTS agent_decisions (
    id VARCHAR(100) PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    customer_id VARCHAR(100),
    decision_type VARCHAR(100) NOT NULL,
    input_payload TEXT NOT NULL,
    output_payload TEXT NOT NULL,
    confidence_score NUMERIC(5, 4),
    status VARCHAR(50) NOT NULL,
    discount_percentage INT DEFAULT 0,
    rollback_status VARCHAR(50) DEFAULT 'NONE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. AI Actions & Human-in-the-Loop Trust Layer
CREATE TABLE IF NOT EXISTS ai_actions (
    id VARCHAR(100) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    payload TEXT DEFAULT '{}',
    expected_impact TEXT NOT NULL,
    confidence INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    approved_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP WITH TIME ZONE
);

-- 16. Payment Recovery Events & Tracking
CREATE TABLE IF NOT EXISTS payment_recovery (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100),
    customer_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    failure_reason TEXT,
    recovery_strategy VARCHAR(100) NOT NULL,
    recovery_status VARCHAR(50) DEFAULT 'pending',
    recovery_action_note TEXT,
    recovered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. A/B Experiments Engine
CREATE TABLE IF NOT EXISTS experiments (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    strategy_a_name VARCHAR(100) NOT NULL,
    strategy_b_name VARCHAR(100) NOT NULL,
    strategy_c_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    winner_variant VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Experiment Event Tracking
CREATE TABLE IF NOT EXISTS experiment_events (
    id VARCHAR(100) PRIMARY KEY,
    experiment_id VARCHAR(100),
    variant VARCHAR(10) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    revenue NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Agent Logs
CREATE TABLE IF NOT EXISTS agent_logs (
    id VARCHAR(100) PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    level VARCHAR(20) DEFAULT 'INFO',
    message TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Knowledge Base Documents (for RAG)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_customer_events_customer ON customer_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_events_type ON customer_events(event_type);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_created ON agent_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_recovery_status ON payment_recovery(recovery_status);
