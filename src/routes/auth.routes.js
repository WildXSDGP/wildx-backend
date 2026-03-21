const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validators/auth.validator');

// POST /api/v1/auth/register - Register new user
router.post('/register', validate(registerSchema), authController.register);

// POST /api/v1/auth/login - Login user
router.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/refresh - Refresh access token
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// POST /api/v1/auth/logout - Logout user
router.post('/logout', authController.logout);

module.exports = router;
