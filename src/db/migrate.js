const sql = require('./client');

// Tables are created manually via Neon SQL Editor (neon_setup.sql)
// This just verifies the DB connection on startup
async function verifyConnection() {
  try {
    await sql`SELECT 1`;
    console.log('✅  Neon PostgreSQL connected');
  } catch (err) {
    console.error('❌  Neon DB connection failed:', err.message);
    console.error('👉  Check your DATABASE_URL in .env');
    throw err;
  }
}

module.exports = verifyConnection;
