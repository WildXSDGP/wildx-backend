const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅  Neon PostgreSQL connected');
  } catch (err) {
    console.error('❌  Database connection failed:', err.message);
  }
}

module.exports = { pool, testConnection };
