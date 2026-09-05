const pool = require('./db');

const createTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS agent_decisions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            session_id VARCHAR(100) NOT NULL,
            customer_id VARCHAR(50),
            decision_type VARCHAR(50) NOT NULL,
            input_payload JSONB NOT NULL,
            output_payload JSONB NOT NULL,
            confidence_score NUMERIC(5, 4),
            status VARCHAR(20) NOT NULL,
            rollback_status VARCHAR(20) DEFAULT 'NONE',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await pool.query(query);
        console.log('✅ agent_decisions table created successfully');
    } catch (err) {
        console.error('❌ Error creating table:', err);
    } finally {
        process.exit();
    }
};

createTable();