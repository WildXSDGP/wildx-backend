const UserModel = require('../models/userModel');

const UserController = {

  // ── GET /api/users ────────────────────────────────────────────
  async getAll(req, res, next) {
    try {
      const users = await UserModel.getAll();
      res.json({ success: true, count: users.length, data: users });
    } catch (err) { next(err); }
  },

  // ── GET /api/users/:id ────────────────────────────────────────
  // Returns full user object including badges[] and top_parks[]
  // This is what the Flutter ProfileScreen calls on load.
  async getById(req, res, next) {
    try {
      const user = await UserModel.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  // ── POST /api/users ───────────────────────────────────────────
  async create(req, res, next) {
    try {
      const { name, email, profile_image_url, location, bio } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: 'name is required' });
      }
      const user = await UserModel.create({ name, email, profile_image_url, location, bio });
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, error: 'Email already exists' });
      }
      next(err);
    }
  },

  // ── PUT /api/users/:id ────────────────────────────────────────
  // Called by Flutter EditProfileScreen on save
  async update(req, res, next) {
    try {
      const { name, email, profile_image_url, location, bio } = req.body;
      const user = await UserModel.update(req.params.id, {
        name, email, profile_image_url, location, bio,
      });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  // ── PATCH /api/users/:id/xp ───────────────────────────────────
  // Updates XP + level — called after a sighting/photo is logged
  async updateXP(req, res, next) {
    try {
      const { xp, current_level } = req.body;
      if (xp === undefined || !current_level) {
        return res.status(400).json({
          success: false, error: 'xp and current_level are required',
        });
      }
      const validLevels = ['explorer', 'ranger', 'guardian'];
      if (!validLevels.includes(current_level)) {
        return res.status(400).json({
          success: false,
          error: `current_level must be one of: ${validLevels.join(', ')}`,
        });
      }
      const user = await UserModel.updateXP(req.params.id, xp, current_level);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  },

  // ── PATCH /api/users/:id/stat ─────────────────────────────────
  // Increments sightings_count | parks_visited | photos_count
  async incrementStat(req, res, next) {
    try {
      const { field } = req.body;
      if (!field) {
        return res.status(400).json({ success: false, error: 'field is required' });
      }
      const user = await UserModel.incrementStat(req.params.id, field);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      if (err.message.startsWith('Invalid stat field')) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next(err);
    }
  },

  // ── DELETE /api/users/:id ─────────────────────────────────────
  async delete(req, res, next) {
    try {
      const deleted = await UserModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) { next(err); }
  },
};

module.exports = UserController;
