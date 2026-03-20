/**
 * ParkModel — SQL queries for the `park_visits` table.
 * Mirrors Flutter's ParkVisit: parkName, visitCount.
 */

const { query } = require('../db/db');

const ParkModel = {

  // ── GET all parks for a user ordered by visits (TopParksCard) ─
  async getByUser(user_id) {
    const res = await query(`
      SELECT * FROM park_visits
      WHERE user_id = $1
      ORDER BY visit_count DESC
    `, [user_id]);
    return res.rows;
  },

  // ── GET single park_visit by id ───────────────────────────────
  async getById(id) {
    const res = await query(
      `SELECT * FROM park_visits WHERE id = $1`, [id]
    );
    return res.rows[0] || null;
  },

  // ── CREATE new park visit record ──────────────────────────────
  async create({ user_id, park_name, visit_count = 1 }) {
    const res = await query(`
      INSERT INTO park_visits (user_id, park_name, visit_count, last_visited)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [user_id, park_name, visit_count]);
    return res.rows[0];
  },

  // ── INCREMENT visit count by 1 ────────────────────────────────
  async incrementVisit(id) {
    const res = await query(`
      UPDATE park_visits
      SET visit_count = visit_count + 1, last_visited = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    return res.rows[0] || null;
  },

  // ── UPDATE park record ────────────────────────────────────────
  async update(id, { park_name, visit_count }) {
    const res = await query(`
      UPDATE park_visits SET
        park_name   = COALESCE($1, park_name),
        visit_count = COALESCE($2, visit_count)
      WHERE id = $3
      RETURNING *
    `, [park_name, visit_count, id]);
    return res.rows[0] || null;
  },

  // ── DELETE park visit ─────────────────────────────────────────
  async delete(id) {
    const res = await query(
      `DELETE FROM park_visits WHERE id = $1 RETURNING id`, [id]
    );
    return res.rows[0] || null;
  },
};

module.exports = ParkModel;
