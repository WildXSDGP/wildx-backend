class AppError extends Error {
  constructor(code, message, statusCode = 400, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const ErrorCodes = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', statusCode: 400 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', statusCode: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', statusCode: 403 },
  NOT_FOUND: { code: 'NOT_FOUND', statusCode: 404 },
  ACCOMMODATION_NOT_FOUND: { code: 'ACCOMMODATION_NOT_FOUND', statusCode: 404 },
  BOOKING_NOT_FOUND: { code: 'BOOKING_NOT_FOUND', statusCode: 404 },
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', statusCode: 404 },
  CONFLICT: { code: 'CONFLICT', statusCode: 409 },
  DATES_UNAVAILABLE: { code: 'DATES_UNAVAILABLE', statusCode: 409 },
  INVALID_DATE_RANGE: { code: 'INVALID_DATE_RANGE', statusCode: 400 },
  EMAIL_EXISTS: { code: 'EMAIL_EXISTS', statusCode: 409 },
  INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', statusCode: 401 },
  INVALID_TOKEN: { code: 'INVALID_TOKEN', statusCode: 401 },
  TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', statusCode: 401 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', statusCode: 500 },
};

module.exports = { AppError, ErrorCodes };
