const { Pool } = require('pg');
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let mode = 'sqlite';
let pgPool = null;
let sqliteDb = null;

const sqlitePath = path.join(__dirname, 'shoppilot.db');

// Initialize native Node.js 22 SQLite Database
function initSqlite() {
  try {
    sqliteDb = new DatabaseSync(sqlitePath);
    console.log('⚡ Using built-in Node 22 SQLite engine at:', sqlitePath);
    mode = 'sqlite';

    // Execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      sqliteDb.exec(schema);
      console.log('✅ SQLite schema verified and ready');
    }
  } catch (err) {
    console.error('❌ Failed to initialize SQLite engine:', err.message);
  }
}

// Check if PostgreSQL is explicitly configured and available
if (process.env.USE_POSTGRES === 'true' && process.env.DB_HOST) {
  try {
    pgPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME || 'shoppilot',
      connectionTimeoutMillis: 2000
    });

    pgPool.connect((err, client, release) => {
      if (err) {
        console.warn('⚠️ PostgreSQL connection unreachable, using native SQLite engine:', err.message);
        pgPool = null;
        initSqlite();
      } else {
        release();
        mode = 'postgres';
        console.log('✅ Connected to PostgreSQL database:', process.env.DB_NAME);
      }
    });
  } catch (err) {
    console.warn('⚠️ PostgreSQL pool failed, defaulting to native SQLite:', err.message);
    initSqlite();
  }
} else {
  initSqlite();
}

/**
 * Unified query method compatible with both PostgreSQL and SQLite
 * Handles param translation ($1 -> ?), ILIKE -> LIKE, and returns { rows, rowCount }
 */
async function query(sql, params = []) {
  if (mode === 'postgres' && pgPool) {
    return await pgPool.query(sql, params);
  }

  // Native SQLite Mode
  if (!sqliteDb) {
    initSqlite();
  }

  // Translate $1, $2 to ?
  let translatedSql = sql.replace(/\$(\d+)/g, '?');
  // Translate ILIKE to LIKE
  translatedSql = translatedSql.replace(/\bILIKE\b/gi, 'LIKE');

  const trimmed = translatedSql.trim();
  const isSelect = /^(SELECT|PRAGMA)/i.test(trimmed);

  try {
    const stmt = sqliteDb.prepare(translatedSql);
    if (isSelect) {
      const rows = stmt.all(...params);
      return {
        rows: rows || [],
        rowCount: rows ? rows.length : 0
      };
    } else {
      const result = stmt.run(...params);
      return {
        rows: [{ id: result.lastInsertRowid }],
        rowCount: result.changes,
        lastInsertRowid: result.lastInsertRowid
      };
    }
  } catch (err) {
    console.error('SQL Execution Error:', err.message, '\nQuery:', translatedSql, '\nParams:', params);
    throw err;
  }
}

module.exports = {
  query,
  getMode: () => mode,
  getSqliteDb: () => sqliteDb,
  getPgPool: () => pgPool
};