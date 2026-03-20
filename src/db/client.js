const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('❌  DATABASE_URL is not set in .env');
  process.exit(1);
}

// Neon serverless SQL client
const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
