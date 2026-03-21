const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { AppError, ErrorCodes } = require('../utils/errors');

class UserService {
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(
        ErrorCodes.USER_NOT_FOUND.code,
        'User not found',
        ErrorCodes.USER_NOT_FOUND.statusCode
      );
    }

    return this.formatUser(user);
  }

  async updateProfile(userId, updateData) {
    const { firstName, lastName, phoneNumber, profileImageUrl } = updateData;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
      },
    });

    return this.formatUser(user);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(
        ErrorCodes.USER_NOT_FOUND.code,
        'User not found',
        ErrorCodes.USER_NOT_FOUND.statusCode
      );
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError(
        ErrorCodes.INVALID_CREDENTIALS.code,
        'Current password is incorrect',
        ErrorCodes.INVALID_CREDENTIALS.statusCode
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Password changed successfully' };
  }

  formatUser(user) {
    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

module.exports = new UserService();
