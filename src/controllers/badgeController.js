const BadgeModel = require('../models/badgeModel');
const UserModel  = require('../models/userModel');

const BadgeController = {

  // ── GET /api/badges/user/:user_id ─────────────────────────────
  // Returns all badges for user — drives AchievementGrid widget
  async getByUser(req, res, next) {
    try {
      const badges = await BadgeModel.getByUser(req.params.user_id);
      res.json({ success: true, count: badges.length, data: badges });
    } catch (err) { next(err); }
  },

  // ── POST /api/badges ──────────────────────────────────────────
  async create(req, res, next) {
    try {
      const { user_id, title, icon_asset, earned } = req.body;
      if (!user_id || !title || !icon_asset) {
        return res.status(400).json({
          success: false,
          error: 'user_id, title, and icon_asset are required',
        });
      }
      // Verify user exists
      const user = await UserModel.getById(user_id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      const badge = await BadgeModel.create({ user_id, title, icon_asset, earned });
      res.status(201).json({ success: true, data: badge });
    } catch (err) { next(err); }
  },

  // ── PATCH /api/badges/:id/earn ────────────────────────────────
  // Called when a user earns a badge — flips earned = true
  async markEarned(req, res, next) {
    try {
      const badge = await BadgeModel.markEarned(req.params.id);
      if (!badge) {
        return res.status(404).json({ success: false, error: 'Badge not found' });
      }
      res.json({ success: true, data: badge });
    } catch (err) { next(err); }
  },

  // ── DELETE /api/badges/:id ────────────────────────────────────
  async delete(req, res, next) {
    try {
      const deleted = await BadgeModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Badge not found' });
      }
      res.json({ success: true, message: 'Badge deleted successfully' });
    } catch (err) { next(err); }
  },
};

module.exports = BadgeController;
