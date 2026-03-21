const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

// All user routes require authentication
router.use(authenticate);

// GET /api/v1/users/me - Get current user profile
router.get('/me', userController.getProfile);

// PUT /api/v1/users/me - Update profile
router.put('/me', validate(updateProfileSchema), userController.updateProfile);

// PUT /api/v1/users/me/password - Change password
router.put(
  '/me/password',
  validate(changePasswordSchema),
  userController.changePassword
);

module.exports = router;
