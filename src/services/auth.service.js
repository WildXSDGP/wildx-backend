const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../utils/prisma');
const { AppError, ErrorCodes } = require('../utils/errors');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phoneNumber } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(
        ErrorCodes.EMAIL_EXISTS.code,
        'A user with this email already exists',
        ErrorCodes.EMAIL_EXISTS.statusCode
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phoneNumber,
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new AppError(
        ErrorCodes.INVALID_CREDENTIALS.code,
        'Invalid email or password',
        ErrorCodes.INVALID_CREDENTIALS.statusCode
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(
        ErrorCodes.INVALID_CREDENTIALS.code,
        'Invalid email or password',
        ErrorCodes.INVALID_CREDENTIALS.statusCode
      );
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: this.formatUser(user),
    };
  }

  async refreshToken(refreshToken) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError(
        ErrorCodes.INVALID_TOKEN.code,
        'Invalid refresh token',
        ErrorCodes.INVALID_TOKEN.statusCode
      );
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError(
        ErrorCodes.TOKEN_EXPIRED.code,
        'Refresh token has expired',
        ErrorCodes.TOKEN_EXPIRED.statusCode
      );
    }

    // Delete old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new tokens
    const tokens = await this.generateTokens(storedToken.user);

    return {
      ...tokens,
      user: this.formatUser(storedToken.user),
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return { message: 'Logged out successfully' };
    }

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logged out successfully' };
  }

  async generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const expiresAt = this.parseExpiry(refreshExpiresIn);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    };
  }

  parseExpiry(expiresIn) {
    const expiresAt = new Date();
    const match = expiresIn.match(/^(\d+)([smhdw]?)$/i);
    
    if (!match) {
      expiresAt.setDate(expiresAt.getDate() + 7);
      return expiresAt;
    }

    const value = parseInt(match[1], 10);
    const unit = (match[2] || 'd').toLowerCase();

    switch (unit) {
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + value);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + value);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + value);
        break;
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + value);
        break;
      case 'w':
        expiresAt.setDate(expiresAt.getDate() + value * 7);
        break;
      default:
        expiresAt.setDate(expiresAt.getDate() + value);
    }

    return expiresAt;
  }

  formatUser(user) {
    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
    };
  }
}

module.exports = new AuthService();
