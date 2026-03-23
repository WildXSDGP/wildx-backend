const { query } = require('../config/db');

const VALID_ANIMAL_TYPES = [
  'SRI_LANKAN_LEOPARD', 'ASIAN_ELEPHANT', 'SPOTTED_DEER',
  'CROCODILE', 'WATER_BUFFALO', 'SLOTH_BEAR',
];

const ANIMAL_DISPLAY_NAMES = {
  SRI_LANKAN_LEOPARD: 'Sri Lankan Leopard',
  ASIAN_ELEPHANT:     'Asian Elephant',
  SPOTTED_DEER:       'Spotted Deer',
  CROCODILE:          'Crocodile',
  WATER_BUFFALO:      'Water Buffalo',
  SLOTH_BEAR:         'Sloth Bear',
};

// e.g. "Sri Lankan Leopard" → "SRI_LANKAN_LEOPARD"
const toDiscriminator = (str) => str.toUpperCase().replace(/\s+/g, '_');

// ─── GET /api/markers/park/:parkId ───────────────────────────
// All markers for a park — ported from findByNationalParkId
exports.getByPark = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM markers WHERE park_id = $1 ORDER BY spotted_at DESC',
      [req.params.parkId]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/park/:parkId/type?animalType= ──────────
// Filtered by animal type discriminator
exports.getByParkAndType = async (req, res, next) => {
  try {
    const discriminator = toDiscriminator(req.query.animalType || '');
    if (!VALID_ANIMAL_TYPES.includes(discriminator))
      return res.status(400).json({ error: `Invalid animalType. Valid: ${VALID_ANIMAL_TYPES.join(', ')}` });

    const result = await query(
      'SELECT * FROM markers WHERE park_id = $1 AND animal_type = $2 ORDER BY spotted_at DESC',
      [req.params.parkId, discriminator]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/park/:parkId/verified ──────────────────
// Only verified markers — findByNationalParkIdAndIsVerifiedTrue
exports.getVerifiedByPark = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM markers WHERE park_id = $1 AND is_verified = TRUE ORDER BY spotted_at DESC',
      [req.params.parkId]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/unverified ─────────────────────────────
// All unverified — for admin review (findByIsVerifiedFalse)
exports.getUnverified = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT m.*, np.name as park_name FROM markers m LEFT JOIN national_parks np ON m.park_id = np.id WHERE m.is_verified = FALSE ORDER BY m.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/park/:parkId/animal-types ──────────────
// Distinct animal types in a park — findDistinctAnimalTypesByParkId
exports.getAnimalTypesInPark = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT DISTINCT animal_type FROM markers WHERE park_id = $1 ORDER BY animal_type',
      [req.params.parkId]
    );
    const types = result.rows.map(r => ({
      discriminator:  r.animal_type,
      display_name:   ANIMAL_DISPLAY_NAMES[r.animal_type] || r.animal_type,
    }));
    res.json(types);
  } catch (err) { next(err); }
};


// ─── GET /api/markers/park/:parkId/counts ────────────────────
// Count by animal type — countMarkersByAnimalType
exports.getCountsByAnimalType = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT animal_type, COUNT(*) AS count FROM markers WHERE park_id = $1 GROUP BY animal_type',
      [req.params.parkId]
    );
    // Build {SRI_LANKAN_LEOPARD: 5, ...} like the Java Map<String,Long>
    const counts = {};
    for (const row of result.rows) {
      counts[row.animal_type] = parseInt(row.count);
    }
    res.json(counts);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/park/:parkId/recent ────────────────────
// Markers from last 24 hours — findRecentMarkersByParkId
exports.getRecentByPark = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM markers
      WHERE park_id = $1
        AND spotted_at >= NOW() - INTERVAL '24 hours'
      ORDER BY spotted_at DESC
    `, [req.params.parkId]);
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/park/:parkId/bounds ────────────────────
// Markers within geographic bounding box — findMarkersInBounds
exports.getInBounds = async (req, res, next) => {
  try {
    const { minLat, maxLat, minLng, maxLng } = req.query;
    if (!minLat || !maxLat || !minLng || !maxLng)
      return res.status(400).json({ error: 'minLat, maxLat, minLng, maxLng are all required' });

    const result = await query(`
      SELECT * FROM markers
      WHERE park_id = $1
        AND latitude  BETWEEN $2 AND $3
        AND longitude BETWEEN $4 AND $5
      ORDER BY spotted_at DESC
    `, [req.params.parkId, minLat, maxLat, minLng, maxLng]);
    res.json(result.rows);
  } catch (err) { next(err); }
};

// ─── GET /api/markers/:markerId ──────────────────────────────
exports.getById = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT m.*, np.name as park_name FROM markers m LEFT JOIN national_parks np ON m.park_id = np.id WHERE m.id = $1',
      [req.params.markerId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Marker not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};