const ParkModel = require('../models/parkModel');
const UserModel = require('../models/userModel');

const ParkController = {

  // ── GET /api/parks/user/:user_id ──────────────────────────────
  // Returns parks ordered by visit_count DESC — drives TopParksCard widget
  async getByUser(req, res, next) {
    try {
      const parks = await ParkModel.getByUser(req.params.user_id);
      res.json({ success: true, count: parks.length, data: parks });
    } catch (err) { next(err); }
  },

  // ── POST /api/parks ───────────────────────────────────────────
  async create(req, res, next) {
    try {
      const { user_id, park_name, visit_count } = req.body;
      if (!user_id || !park_name) {
        return res.status(400).json({
          success: false, error: 'user_id and park_name are required',
        });
      }
      const user = await UserModel.getById(user_id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      const park = await ParkModel.create({ user_id, park_name, visit_count });
      res.status(201).json({ success: true, data: park });
    } catch (err) { next(err); }
  },

  // ── PATCH /api/parks/:id/visit ────────────────────────────────
  // Increments visit_count by 1 each time user visits a park
  async incrementVisit(req, res, next) {
    try {
      const park = await ParkModel.incrementVisit(req.params.id);
      if (!park) {
        return res.status(404).json({ success: false, error: 'Park record not found' });
      }
      res.json({ success: true, data: park });
    } catch (err) { next(err); }
  },

  // ── PUT /api/parks/:id ────────────────────────────────────────
  async update(req, res, next) {
    try {
      const { park_name, visit_count } = req.body;
      const park = await ParkModel.update(req.params.id, { park_name, visit_count });
      if (!park) {
        return res.status(404).json({ success: false, error: 'Park record not found' });
      }
      res.json({ success: true, data: park });
    } catch (err) { next(err); }
  },

  // ── DELETE /api/parks/:id ─────────────────────────────────────
  async delete(req, res, next) {
    try {
      const deleted = await ParkModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Park record not found' });
      }
      res.json({ success: true, message: 'Park record deleted successfully' });
    } catch (err) { next(err); }
  },
};

module.exports = ParkController;
