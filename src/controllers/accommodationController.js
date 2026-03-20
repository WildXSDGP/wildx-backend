const { query } = require('../config/db');

// GET /api/accommodations
const getAll = async (req, res) => {
  try {
    const result = await query('SELECT * FROM accommodations ORDER BY rating DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/accommodations/:id
const getById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM accommodations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/accommodations
const create = async (req, res) => {
  const { name, location, price, distance, rating, image_url, park_id } = req.body;
  try {
    const result = await query(
      `INSERT INTO accommodations (name, location, price, distance, rating, image_url, park_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, location, price, distance, rating, image_url, park_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create };
