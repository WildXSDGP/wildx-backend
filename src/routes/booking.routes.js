const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validate, validateQuery } = require('../middleware/validate.middleware');
const {
  createBookingSchema,
  bookingQuerySchema,
} = require('../validators/booking.validator');

// POST /api/v1/bookings - Create a new booking (auth optional - links to user if logged in)
router.post('/', optionalAuth, validate(createBookingSchema), bookingController.create);

// Protected routes (require authentication)
router.use(authenticate);

// GET /api/v1/bookings - List user's bookings
router.get('/', validateQuery(bookingQuerySchema), bookingController.getAll);

// GET /api/v1/bookings/:bookingId - Get single booking
router.get('/:bookingId', bookingController.getById);

// DELETE /api/v1/bookings/:bookingId - Cancel booking
router.delete('/:bookingId', bookingController.cancel);

module.exports = router;
