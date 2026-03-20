const express = require('express');
const router  = express.Router();
const { register, login, health } = require('../controllers/authController');

// GET  /api/auth/health    — server status check
router.get('/health', health);

// POST /api/auth/register  — Sign Up (create new user in Neon DB)
router.post('/register', register);

// POST /api/auth/login     — Login (update last_login in Neon DB)
router.post('/login', login);

module.exports = router;
