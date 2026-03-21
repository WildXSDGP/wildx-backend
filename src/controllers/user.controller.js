const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.userId);
      return successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.userId, req.body);
      return successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );
      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
