const accommodationService = require('../services/accommodation.service');
const { successResponse, paginatedResponse } = require('../utils/response');

class AccommodationController {
  async getAll(req, res, next) {
    try {
      const result = await accommodationService.findAll(req.query);
      return paginatedResponse(res, { accommodations: result.accommodations }, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const accommodation = await accommodationService.findById(req.params.id);
      return successResponse(res, accommodation);
    } catch (error) {
      next(error);
    }
  }

  async checkAvailability(req, res, next) {
    try {
      const { checkIn, checkOut, guests } = req.query;
      const availability = await accommodationService.checkAvailability(
        req.params.id,
        checkIn,
        checkOut,
        guests
      );
      return successResponse(res, availability);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccommodationController();
