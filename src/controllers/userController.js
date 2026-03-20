const {
  getAllUsers,
  findByFirebaseUid,
  deactivateUser,
  deleteUser,
} = require('../models/userModel');

// ═══════════════════════════════════════════════════════════
// User Controller
// ═══════════════════════════════════════════════════════════

// ── GET /api/users ─────────────────────────────────────────
// All users list
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/users/:firebaseUid ────────────────────────────
// Single user by Firebase UID
const getUserByUid = async (req, res) => {
  try {
    const user = await findByFirebaseUid(req.params.firebaseUid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/users/:firebaseUid ─────────────────────────
// Delete user
const removeUser = async (req, res) => {
  try {
    const user = await deleteUser(req.params.firebaseUid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUsers, getUserByUid, removeUser };
