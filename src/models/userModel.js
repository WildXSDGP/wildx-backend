const { pool } = require('./db');

// ═══════════════════════════════════════════════════════════
// User Model — All SQL queries for the users table
// ═══════════════════════════════════════════════════════════

// ── SELECT: Find by Firebase UID ───────────────────────────
const findByFirebaseUid = async (firebaseUid) => {
  const sql = `SELECT * FROM users WHERE firebase_uid = $1`;
  const result = await pool.query(sql, [firebaseUid]);
  return result.rows[0] || null;
};

// ── SELECT: Find by Email ──────────────────────────────────
const findByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(sql, [email]);
  return result.rows[0] || null;
};

// ── SELECT: Find by Phone ──────────────────────────────────
const findByPhone = async (phoneNumber) => {
  const sql = `SELECT * FROM users WHERE phone_number = $1`;
  const result = await pool.query(sql, [phoneNumber]);
  return result.rows[0] || null;
};

// ── SELECT: Get all users ──────────────────────────────────
const getAllUsers = async () => {
  const sql = `
    SELECT id, firebase_uid, email, phone_number, display_name,
           photo_url, auth_provider, is_active, created_at, last_login_at
    FROM users
    ORDER BY created_at DESC
  `;
  const result = await pool.query(sql);
  return result.rows;
};

// ── INSERT: Create new user ────────────────────────────────
const createUser = async ({ firebaseUid, email, phoneNumber, displayName, photoUrl, authProvider }) => {
  const sql = `
    INSERT INTO users
      (firebase_uid, email, phone_number, display_name, photo_url, auth_provider)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    firebaseUid,
    email       || null,
    phoneNumber || null,
    displayName || null,
    photoUrl    || null,
    authProvider,
  ];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

// ── UPDATE: Update last login time + profile ───────────────
const updateLastLogin = async (firebaseUid, displayName, photoUrl) => {
  const sql = `
    UPDATE users
    SET last_login_at = NOW(),
        display_name  = COALESCE($2, display_name),
        photo_url     = COALESCE($3, photo_url)
    WHERE firebase_uid = $1
    RETURNING *
  `;
  const result = await pool.query(sql, [firebaseUid, displayName || null, photoUrl || null]);
  return result.rows[0];
};

// ── UPDATE: Deactivate user ────────────────────────────────
const deactivateUser = async (firebaseUid) => {
  const sql = `UPDATE users SET is_active = false WHERE firebase_uid = $1 RETURNING *`;
  const result = await pool.query(sql, [firebaseUid]);
  return result.rows[0];
};

// ── DELETE: Remove user ────────────────────────────────────
const deleteUser = async (firebaseUid) => {
  const sql = `DELETE FROM users WHERE firebase_uid = $1 RETURNING *`;
  const result = await pool.query(sql, [firebaseUid]);
  return result.rows[0];
};

module.exports = {
  findByFirebaseUid,
  findByEmail,
  findByPhone,
  getAllUsers,
  createUser,
  updateLastLogin,
  deactivateUser,
  deleteUser,
};
