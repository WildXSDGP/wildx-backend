const sql = require('../db/client');

// GET /api/safety-tips?category=wildlife
const getTips = async (req, res) => {
  try {
    const { category } = req.query;
    const tips = category
      ? await sql`SELECT * FROM safety_tips WHERE is_active = TRUE AND category = ${category} ORDER BY sort_order ASC`
      : await sql`SELECT * FROM safety_tips WHERE is_active = TRUE ORDER BY sort_order ASC`;

    res.json({ success: true, data: tips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/safety-tips
const createTip = async (req, res) => {
  try {
    const { tip, category = 'wildlife', sort_order = 0 } = req.body;
    if (!tip) return res.status(400).json({ success: false, message: 'tip is required' });

    const result = await sql`
      INSERT INTO safety_tips (tip, category, sort_order)
      VALUES (${tip}, ${category}, ${sort_order})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/safety-tips/:id
const deleteTip = async (req, res) => {
  try {
    const result = await sql`
      UPDATE safety_tips SET is_active = FALSE WHERE id = ${req.params.id} RETURNING id
    `;
    if (!result.length)
      return res.status(404).json({ success: false, message: 'Tip not found' });
    res.json({ success: true, message: 'Tip deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTips, createTip, deleteTip };
