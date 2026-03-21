const { z } = require('zod');

const accommodationQuerySchema = z.object({
  maxPrice: z.coerce.number().positive().optional(),
  maxDistance: z.coerce.number().positive().optional(),
  ecoFriendly: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  familyFriendly: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  hasJeepHire: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  parkName: z.string().optional(),
  sortBy: z.enum(['rating', 'distance', 'price', 'familyFriendly']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const availabilityQuerySchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  guests: z.coerce.number().int().positive().optional(),
});

module.exports = {
  accommodationQuerySchema,
  availabilityQuerySchema,
};
