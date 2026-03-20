/**
 * Global error handler middleware.
 * Catches anything passed via next(err) in controllers.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  // Postgres unique constraint
  if (err.code === '23505') {
    return res.status(409).json({ success: false, error: 'Duplicate entry — value already exists' });
  }
  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, error: 'Referenced record does not exist' });
  }
  // Postgres check constraint
  if (err.code === '23514') {
    return res.status(400).json({ success: false, error: 'Value failed database constraint check' });
  }

  res.status(500).json({
    success: false,
    error:   process.env.NODE_ENV === 'production'
               ? 'Internal server error'
               : err.message,
  });
};

module.exports = errorHandler;
