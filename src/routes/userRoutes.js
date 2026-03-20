const express    = require('express');
const router     = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getUsers, getUserByUid, removeUser } = require('../controllers/userController');

// GET    /api/users              — all users
router.get('/', getUsers);

// GET    /api/users/:firebaseUid — single user
router.get('/:firebaseUid', getUserByUid);

// DELETE /api/users/:firebaseUid — delete user (protected)
router.delete('/:firebaseUid', verifyToken, removeUser);

module.exports = router;
