const prisma = require('../utils/prisma');
const { AppError, ErrorCodes } = require('../utils/errors');
const crypto = require('crypto');

const CHILD_RATE = 0.5;
const SERVICE_FEE_PERCENT = 0.05;

class BookingService {
  generateBookingId() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(2).toString('hex');
    return `BK-${timestamp}-${random}`;
  }

  calculatePricing(pricePerNight, adults, children, nights) {
    const adultCost = pricePerNight * adults * nights;
    const childCost = pricePerNight * CHILD_RATE * children * nights;
    const accommodationCost = adultCost + childCost;
    const serviceFee = accommodationCost * SERVICE_FEE_PERCENT;
    const totalPrice = accommodationCost + serviceFee;

    return {
      accommodationCost: Math.round(accommodationCost * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  }

  async create(userId, bookingData) {
    const { accommodationId, checkInDate, checkOutDate, adults, children = 0 } = bookingData;

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: accommodationId },
      include: { park: true },
    });

    if (!accommodation) {
      throw new AppError(
        ErrorCodes.ACCOMMODATION_NOT_FOUND.code,
        'Accommodation not found',
        ErrorCodes.ACCOMMODATION_NOT_FOUND.statusCode
      );
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new AppError(
        ErrorCodes.INVALID_DATE_RANGE.code,
        'Check-in date must be today or in the future',
        ErrorCodes.INVALID_DATE_RANGE.statusCode
      );
    }

    if (checkOut <= checkIn) {
      throw new AppError(
        ErrorCodes.INVALID_DATE_RANGE.code,
        'Check-out date must be after check-in date',
        ErrorCodes.INVALID_DATE_RANGE.statusCode
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.count({
      where: {
        accommodationId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            checkInDate: { lte: checkOut },
            checkOutDate: { gte: checkIn },
          },
        ],
      },
    });

    if (overlappingBookings > 0) {
      throw new AppError(
        ErrorCodes.DATES_UNAVAILABLE.code,
        'The selected dates are not available',
        ErrorCodes.DATES_UNAVAILABLE.statusCode
      );
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const pricePerNight = parseFloat(accommodation.pricePerNight);
    const pricing = this.calculatePricing(pricePerNight, adults, children, nights);

    const bookingId = this.generateBookingId();

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        accommodationId,
        userId: userId || null,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults,
        children,
        accommodationCost: pricing.accommodationCost,
        serviceFee: pricing.serviceFee,
        totalPrice: pricing.totalPrice,
        status: 'confirmed',
      },
      include: {
        accommodation: {
          include: { park: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
        },
      },
    });

    return this.formatBooking(booking);
  }

  async findByUser(userId, filters) {
    const { status, upcoming, page = 1, limit = 20 } = filters;

    const where = { userId };

    if (status) {
      where.status = status;
    }

    if (upcoming) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.checkInDate = { gte: today };
      where.status = { in: ['pending', 'confirmed'] };
    }

    const skip = (page - 1) * limit;

    const [bookings, totalItems] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          accommodation: {
            include: { park: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      bookings: bookings.map(this.formatBooking),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async findById(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        accommodation: {
          include: { park: true, images: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });

    if (!booking) {
      throw new AppError(
        ErrorCodes.BOOKING_NOT_FOUND.code,
        'Booking not found',
        ErrorCodes.BOOKING_NOT_FOUND.statusCode
      );
    }

    if (booking.userId !== userId) {
      throw new AppError(
        ErrorCodes.FORBIDDEN.code,
        'You do not have permission to view this booking',
        ErrorCodes.FORBIDDEN.statusCode
      );
    }

    return this.formatBooking(booking);
  }

  async cancel(bookingId, userId) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new AppError(
        ErrorCodes.BOOKING_NOT_FOUND.code,
        'Booking not found',
        ErrorCodes.BOOKING_NOT_FOUND.statusCode
      );
    }

    if (booking.userId !== userId) {
      throw new AppError(
        ErrorCodes.FORBIDDEN.code,
        'You do not have permission to cancel this booking',
        ErrorCodes.FORBIDDEN.statusCode
      );
    }

    if (booking.status === 'cancelled') {
      throw new AppError(
        ErrorCodes.CONFLICT.code,
        'Booking is already cancelled',
        ErrorCodes.CONFLICT.statusCode
      );
    }

    if (booking.status === 'completed') {
      throw new AppError(
        ErrorCodes.CONFLICT.code,
        'Cannot cancel a completed booking',
        ErrorCodes.CONFLICT.statusCode
      );
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
    });

    return { message: 'Booking cancelled successfully' };
  }

  formatBooking(booking) {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    return {
      bookingId: booking.id,
      accommodationId: booking.accommodationId,
      accommodationName: booking.accommodation.name,
      parkName: booking.accommodation.park.name,
      imageUrl: booking.accommodation.images[0]?.imageUrl || null,
      checkInDate: booking.checkInDate.toISOString(),
      checkOutDate: booking.checkOutDate.toISOString(),
      nights,
      adults: booking.adults,
      children: booking.children,
      totalGuests: booking.adults + booking.children,
      accommodationCost: parseFloat(booking.accommodationCost),
      serviceFee: parseFloat(booking.serviceFee),
      totalPrice: parseFloat(booking.totalPrice),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
    };
  }
}

module.exports = new BookingService();
