const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in .env');
  process.exit(1);
}

// pg Pool — works directly with Neon's connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
  max:              10,               // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('🗄️   Neon PostgreSQL connected');
  }
});

pool.on('error', (err) => {
  console.error('❌  Unexpected pg pool error:', err.message);
});

/**
 * Parameterised query helper.
 * @example  await query('SELECT * FROM users WHERE id = $1', [id])
 */
const query = (text, params) => pool.query(text, params);

/**
 * Run multiple queries inside a single transaction.
 * Automatically rolls back on error.
 * @example
 *   await transaction(async (client) => {
 *     await client.query('INSERT INTO users ...');
 *     await client.query('INSERT INTO badges ...');
 *   });
 */
const transaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { query, transaction, pool };
