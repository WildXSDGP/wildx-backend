const bookingService = require('../services/booking.service');
const { successResponse, paginatedResponse } = require('../utils/response');

class BookingController {
  async create(req, res, next) {
    try {
      // Use user ID if authenticated, null for guest bookings
      const userId = req.user?.userId || null;
      const booking = await bookingService.create(userId, req.body);
      return successResponse(res, booking, 'Booking created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await bookingService.findByUser(req.user.userId, req.query);
      return paginatedResponse(res, { bookings: result.bookings }, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const booking = await bookingService.findById(req.params.bookingId, req.user.userId);
      return successResponse(res, booking);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const result = await bookingService.cancel(req.params.bookingId, req.user.userId);
      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
