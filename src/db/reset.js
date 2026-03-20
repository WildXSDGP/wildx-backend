/**
 * WildX — Database Reset
 * Drops all tables and re-runs migration + seed.
 * WARNING: destroys all data.
 *
 * Run:  npm run db:reset
 */

const { query } = require('./db');

async function reset() {
  console.log('\n⚠️   WildX — Resetting database (all data will be lost)...\n');

  await query(`DROP TABLE IF EXISTS park_visits CASCADE;`);
  await query(`DROP TABLE IF EXISTS badges      CASCADE;`);
  await query(`DROP TABLE IF EXISTS users       CASCADE;`);
  await query(`DROP FUNCTION IF EXISTS fn_updated_at CASCADE;`);
  console.log('  ✅  All tables dropped');

  console.log('\n  🔄  Re-running migration...');
  // Dynamically require so the fresh pool picks up
  require('child_process').execSync('node src/db/migrate.js', { stdio: 'inherit' });
}

reset().catch((err) => {
  console.error('\n  ❌  Reset failed:', err.message, '\n');
  process.exit(1);
});
