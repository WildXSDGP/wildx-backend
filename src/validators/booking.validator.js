const { z } = require('zod');

const createBookingSchema = z.object({
  accommodationId: z.string().min(1, 'Accommodation ID is required'),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  adults: z.coerce.number().int().min(1, 'At least 1 adult is required').max(20),
  children: z.coerce.number().int().min(0).max(20).default(0),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  },
  { message: 'Check-out date must be after check-in date', path: ['checkOutDate'] }
).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkIn >= today;
  },
  { message: 'Check-in date must be today or in the future', path: ['checkInDate'] }
).refine(
  (data) => data.adults + data.children <= 20,
  { message: 'Total guests cannot exceed 20', path: ['adults'] }
);

const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']).optional(),
  upcoming: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

module.exports = {
  createBookingSchema,
  bookingQuerySchema,
};
