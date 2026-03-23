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