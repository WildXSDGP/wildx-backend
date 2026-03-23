const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }, // Required for Neon.tech
});

module.exports = pool;


// ── Park-scoped routes (MUST come before /:markerId) ─────────
router.get('/park/:parkId',               ctrl.getByPark);
router.get('/park/:parkId/type',          ctrl.getByParkAndType);
router.get('/park/:parkId/verified',      ctrl.getVerifiedByPark);
router.get('/park/:parkId/animal-types',  ctrl.getAnimalTypesInPark);
router.get('/park/:parkId/counts',        ctrl.getCountsByAnimalType);
router.get('/park/:parkId/recent',        ctrl.getRecentByPark);
router.get('/park/:parkId/bounds',        ctrl.getInBounds);

