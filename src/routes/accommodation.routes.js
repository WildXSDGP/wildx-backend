const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodation.controller');
const { validateQuery } = require('../middleware/validate.middleware');
const {
  accommodationQuerySchema,
  availabilityQuerySchema,
} = require('../validators/accommodation.validator');

// GET /api/v1/accommodations - List all accommodations with filters
router.get(
  '/',
  validateQuery(accommodationQuerySchema),
  accommodationController.getAll
);

// GET /api/v1/accommodations/:id - Get single accommodation
router.get('/:id', accommodationController.getById);

// GET /api/v1/accommodations/:id/availability - Check availability
router.get(
  '/:id/availability',
  validateQuery(availabilityQuerySchema),
  accommodationController.checkAvailability
);

module.exports = router;
