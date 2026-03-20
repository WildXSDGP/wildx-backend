const { query } = require('../config/db');

// GET /api/parks
const getAllParks = async (req, res) => {
  try {
    const result = await query('SELECT * FROM parks ORDER BY is_featured DESC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/parks/featured
const getFeaturedPark = async (req, res) => {
  try {
    const result = await query('SELECT * FROM parks WHERE is_featured = TRUE LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No featured park found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/parks/:id
const getParkById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM parks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Park not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/parks
const createPark = async (req, res) => {
  const { name, location, image_url, description, animal_count, is_featured } = req.body;
  try {
    const result = await query(
      `INSERT INTO parks (name, location, image_url, description, animal_count, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, location, image_url, description, animal_count || 0, is_featured || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/parks/:id
const updatePark = async (req, res) => {
  const { name, location, image_url, description, animal_count, is_featured } = req.body;
  try {
    const result = await query(
      `UPDATE parks SET name=$1, location=$2, image_url=$3, description=$4,
       animal_count=$5, is_featured=$6 WHERE id=$7 RETURNING *`,
      [name, location, image_url, description, animal_count, is_featured, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Park not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/parks/:id
const deletePark = async (req, res) => {
  try {
    const result = await query('DELETE FROM parks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Park not found' });
    res.json({ message: 'Park deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllParks, getFeaturedPark, getParkById, createPark, updatePark, deletePark };
