/**
 * UserModel — SQL queries for the `users` table.
 * Mirrors Flutter's UserModel fields exactly.
 */

const { query } = require('../db/db');

const UserModel = {

  // ── GET all users ────────────────────────────────────────────
  async getAll() {
    const res = await query(`
      SELECT * FROM users
      ORDER BY created_at DESC
    `);
    return res.rows;
  },

  // ── GET user by id (includes badges + park_visits) ───────────
  // This single call returns everything the Flutter ProfileScreen needs.
  async getById(id) {
    // Main user row
    const userRes = await query(
      `SELECT * FROM users WHERE id = $1`, [id]
    );
    if (userRes.rows.length === 0) return null;
    const user = userRes.rows[0];

    // Badges (AchievementGrid widget)
    const badgesRes = await query(
      `SELECT * FROM badges WHERE user_id = $1 ORDER BY id ASC`, [id]
    );

    // Park visits ordered by visit_count DESC (TopParksCard widget)
    const parksRes = await query(
      `SELECT * FROM park_visits WHERE user_id = $1 ORDER BY visit_count DESC`, [id]
    );

    return {
      ...user,
      badges:     badgesRes.rows,
      top_parks:  parksRes.rows,
    };
  },

  // ── GET user by email ────────────────────────────────────────
  async getByEmail(email) {
    const res = await query(
      `SELECT * FROM users WHERE email = $1`, [email]
    );
    return res.rows[0] || null;
  },

  // ── CREATE user ──────────────────────────────────────────────
  async create({ name, email, profile_image_url, location, bio }) {
    const res = await query(`
      INSERT INTO users (name, email, profile_image_url, location, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, email, profile_image_url, location, bio]);
    return res.rows[0];
  },

  // ── UPDATE profile fields (Edit Profile screen) ──────────────
  async update(id, { name, email, profile_image_url, location, bio }) {
    const res = await query(`
      UPDATE users SET
        name              = COALESCE($1, name),
        email             = COALESCE($2, email),
        profile_image_url = COALESCE($3, profile_image_url),
        location          = COALESCE($4, location),
        bio               = COALESCE($5, bio)
      WHERE id = $6
      RETURNING *
    `, [name, email, profile_image_url, location, bio, id]);
    return res.rows[0] || null;
  },

  // ── UPDATE xp + level (XPProgressCard widget) ────────────────
  async updateXP(id, xp, current_level) {
    const res = await query(`
      UPDATE users
      SET xp = $1, current_level = $2
      WHERE id = $3
      RETURNING *
    `, [xp, current_level, id]);
    return res.rows[0] || null;
  },

  // ── INCREMENT a stat counter ──────────────────────────────────
  // field must be one of: sightings_count | parks_visited | photos_count
  async incrementStat(id, field) {
    const allowed = ['sightings_count', 'parks_visited', 'photos_count'];
    if (!allowed.includes(field)) {
      throw new Error(`Invalid stat field "${field}". Must be one of: ${allowed.join(', ')}`);
    }
    const res = await query(`
      UPDATE users
      SET ${field} = ${field} + 1
      WHERE id = $1
      RETURNING *
    `, [id]);
    return res.rows[0] || null;
  },

  // ── DELETE user ───────────────────────────────────────────────
  async delete(id) {
    const res = await query(
      `DELETE FROM users WHERE id = $1 RETURNING id`, [id]
    );
    return res.rows[0] || null;
  },
};

module.exports = UserModel;
