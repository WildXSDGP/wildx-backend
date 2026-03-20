/**
 * BadgeModel — SQL queries for the `badges` table.
 * Mirrors Flutter's BadgeModel: title, iconAsset, earned.
 */

const { query } = require('../db/db');

const BadgeModel = {

  // ── GET all badges for a user (AchievementGrid widget) ───────
  async getByUser(user_id) {
    const res = await query(
      `SELECT * FROM badges WHERE user_id = $1 ORDER BY id ASC`,
      [user_id]
    );
    return res.rows;
  },

  // ── GET single badge by id ────────────────────────────────────
  async getById(id) {
    const res = await query(
      `SELECT * FROM badges WHERE id = $1`, [id]
    );
    return res.rows[0] || null;
  },

  // ── CREATE badge for a user ───────────────────────────────────
  async create({ user_id, title, icon_asset, earned = false }) {
    const res = await query(`
      INSERT INTO badges (user_id, title, icon_asset, earned, earned_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, title, icon_asset, earned, earned ? new Date() : null]);
    return res.rows[0];
  },

  // ── MARK badge as earned ──────────────────────────────────────
  async markEarned(id) {
    const res = await query(`
      UPDATE badges
      SET earned = TRUE, earned_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    return res.rows[0] || null;
  },

  // ── DELETE badge ──────────────────────────────────────────────
  async delete(id) {
    const res = await query(
      `DELETE FROM badges WHERE id = $1 RETURNING id`, [id]
    );
    return res.rows[0] || null;
  },
};

module.exports = BadgeModel;
