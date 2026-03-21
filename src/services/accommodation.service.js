const prisma = require('../utils/prisma');
const { AppError, ErrorCodes } = require('../utils/errors');

class AccommodationService {
  async findAll(filters) {
    const {
      maxPrice,
      maxDistance,
      ecoFriendly,
      familyFriendly,
      hasJeepHire,
      parkName,
      sortBy = 'rating',
      sortOrder,
      page = 1,
      limit = 20,
    } = filters;

    const where = {};

    if (maxPrice) {
      where.pricePerNight = { lte: maxPrice };
    }

    if (maxDistance) {
      where.distanceFromGate = { lte: maxDistance };
    }

    if (ecoFriendly !== undefined) {
      where.isEcoFriendly = ecoFriendly;
    }

    if (familyFriendly !== undefined) {
      where.isFamilyFriendly = familyFriendly;
    }

    if (hasJeepHire !== undefined) {
      where.hasJeepHire = hasJeepHire;
    }

    if (parkName) {
      where.park = { name: { contains: parkName, mode: 'insensitive' } };
    }

    // Determine sort configuration
    let orderBy = {};
    const order = sortOrder || this.getDefaultSortOrder(sortBy);

    switch (sortBy) {
      case 'rating':
        orderBy = { rating: order };
        break;
      case 'distance':
        orderBy = { distanceFromGate: order };
        break;
      case 'price':
        orderBy = { pricePerNight: order };
        break;
      case 'familyFriendly':
        orderBy = { isFamilyFriendly: order };
        break;
      default:
        orderBy = { rating: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [accommodations, totalItems] = await Promise.all([
      prisma.accommodation.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          park: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
      prisma.accommodation.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      accommodations: accommodations.map(this.formatAccommodation),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    };
  }

  async findById(id) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        park: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!accommodation) {
      throw new AppError(
        ErrorCodes.ACCOMMODATION_NOT_FOUND.code,
        'Accommodation not found',
        ErrorCodes.ACCOMMODATION_NOT_FOUND.statusCode
      );
    }

    return this.formatAccommodation(accommodation);
  }

  async checkAvailability(id, checkIn, checkOut, guests) {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
    });

    if (!accommodation) {
      throw new AppError(
        ErrorCodes.ACCOMMODATION_NOT_FOUND.code,
        'Accommodation not found',
        ErrorCodes.ACCOMMODATION_NOT_FOUND.statusCode
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      throw new AppError(
        ErrorCodes.INVALID_DATE_RANGE.code,
        'Check-out date must be after check-in date',
        ErrorCodes.INVALID_DATE_RANGE.statusCode
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.count({
      where: {
        accommodationId: id,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          {
            checkInDate: { lte: checkOutDate },
            checkOutDate: { gte: checkInDate },
          },
        ],
      },
    });

    const totalNights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const pricePerNight = parseFloat(accommodation.pricePerNight);
    const estimatedTotal = pricePerNight * totalNights;

    return {
      available: overlappingBookings === 0,
      pricePerNight,
      totalNights,
      estimatedTotal,
    };
  }

  getDefaultSortOrder(sortBy) {
    switch (sortBy) {
      case 'rating':
        return 'desc';
      case 'distance':
        return 'asc';
      case 'price':
        return 'asc';
      case 'familyFriendly':
        return 'desc';
      default:
        return 'desc';
    }
  }

  formatAccommodation(accommodation) {
    return {
      id: accommodation.id,
      name: accommodation.name,
      parkName: accommodation.park.name,
      pricePerNight: parseFloat(accommodation.pricePerNight),
      distanceFromGate: parseFloat(accommodation.distanceFromGate),
      travelTime: accommodation.travelTime,
      fuelStops: accommodation.fuelStops,
      rating: parseFloat(accommodation.rating),
      isEcoFriendly: accommodation.isEcoFriendly,
      isFamilyFriendly: accommodation.isFamilyFriendly,
      hasJeepHire: accommodation.hasJeepHire,
      imageUrls: accommodation.images.map((img) => img.imageUrl),
      description: accommodation.description,
    };
  }
}

module.exports = new AccommodationService();
