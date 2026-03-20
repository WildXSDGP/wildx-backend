const { Pool } = require('pg');

// ── Neon PostgreSQL Connection Pool ───────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,                // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ── Test connection on startup ─────────────────────────────
const initDB = async () => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    console.log('✅ Neon DB connected:', result.rows[0].time);
  } catch (err) {
    console.error('❌ Neon DB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, initDB };
