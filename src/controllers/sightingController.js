const { query } = require('../config/db');

// GET /api/sightings/recent
const getRecentSightings = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sightings ORDER BY created_at DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sightings/my  (auth required)
const getMySightings = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM sightings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/sightings/:id
const getSightingById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM sightings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Sighting not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/sightings  (auth required)
const createSighting = async (req, res) => {
  const { animal_name, park_name, sighting_date, image_url, category, notes, park_id } = req.body;
  try {
    const result = await query(
      `INSERT INTO sightings (animal_name, park_name, sighting_date, image_url, category, notes, user_id, park_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [animal_name, park_name, sighting_date, image_url, category, notes, req.user.id, park_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/sightings/:id  (auth required)
const updateSighting = async (req, res) => {
  const { animal_name, park_name, sighting_date, image_url, category, notes } = req.body;
  try {
    // Verify ownership
    const check = await query('SELECT user_id FROM sightings WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Sighting not found' });
    if (check.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const result = await query(
      `UPDATE sightings SET animal_name=$1, park_name=$2, sighting_date=$3,
       image_url=$4, category=$5, notes=$6 WHERE id=$7 RETURNING *`,
      [animal_name, park_name, sighting_date, image_url, category, notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/sightings/:id  (auth required)
const deleteSighting = async (req, res) => {
  try {
    const check = await query('SELECT user_id FROM sightings WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Sighting not found' });
    if (check.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    await query('DELETE FROM sightings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Sighting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getRecentSightings, getMySightings, getSightingById,
  createSighting, updateSighting, deleteSighting
};
