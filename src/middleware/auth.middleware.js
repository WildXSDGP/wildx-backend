const jwt = require('jsonwebtoken');
const { AppError, ErrorCodes } = require('../utils/errors');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        ErrorCodes.UNAUTHORIZED.code,
        'Authentication required',
        ErrorCodes.UNAUTHORIZED.statusCode
      );
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(
        ErrorCodes.TOKEN_EXPIRED.code,
        'Token has expired',
        ErrorCodes.TOKEN_EXPIRED.statusCode
      ));
    }
    
    return next(new AppError(
      ErrorCodes.INVALID_TOKEN.code,
      'Invalid token',
      ErrorCodes.INVALID_TOKEN.statusCode
    ));
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuth };
