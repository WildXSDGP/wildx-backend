const { validationResult } = require('express-validator');
const SightingModel = require('../models/sightingModel');

const SightingController = {

  // GET /api/sightings
  async getAll(req, res) {
    try {
      const { animal_type, limit, offset } = req.query;
      const sightings = await SightingModel.getAll({
        animalType: animal_type,
        limit:  parseInt(limit)  || 50,
        offset: parseInt(offset) || 0,
      });
      res.json({ success: true, data: sightings, count: sightings.length });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch sightings' });
    }
  },

  // GET /api/sightings/:id
  async getById(req, res) {
    try {
      const sighting = await SightingModel.getById(req.params.id);
      if (!sighting) {
        return res.status(404).json({ success: false, error: 'Sighting not found' });
      }
      res.json({ success: true, data: sighting });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch sighting' });
    }
  },

  // POST /api/sightings
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { animalType, photoPath, locationName, latitude, longitude, notes } = req.body;
      const sighting = await SightingModel.create({
        animalType, photoPath, locationName, latitude, longitude, notes,
      });
      res.status(201).json({ success: true, data: sighting });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to create sighting' });
    }
  },

  // PUT /api/sightings/:id/status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const allowed = ['submitted', 'verified', 'rejected'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      const updated = await SightingModel.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Sighting not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to update status' });
    }
  },

  // DELETE /api/sightings/:id
  async delete(req, res) {
    try {
      const deleted = await SightingModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Sighting not found' });
      }
      res.json({ success: true, message: 'Sighting deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to delete sighting' });
    }
  },

  // GET /api/sightings/stats
  async getStats(req, res) {
    try {
      const stats = await SightingModel.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
  },
};

module.exports = SightingController;
