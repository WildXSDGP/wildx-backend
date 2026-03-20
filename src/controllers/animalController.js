const AnimalModel = require('../models/animalModel');

const AnimalController = {
  async getAll(req, res) {
    try {
      const animals = await AnimalModel.getAll();
      res.json({ success: true, data: animals });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to fetch animals' });
    }
  },
};

module.exports = AnimalController;
