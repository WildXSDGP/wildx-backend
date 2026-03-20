const admin = require('firebase-admin');

// ── Firebase Token Verification Middleware ─────────────────
// Protected routes ගෙ use කරන්නේ
// Usage: router.get('/profile', verifyToken, controller)
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Include Authorization: Bearer <token>',
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // attach decoded token to request
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: err.message,
    });
  }
};

module.exports = verifyToken;
