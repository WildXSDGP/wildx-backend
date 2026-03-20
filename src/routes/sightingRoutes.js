const express    = require('express');
const { body }   = require('express-validator');
const controller = require('../controllers/sightingController');

const router = express.Router();

// Validation rules
const createRules = [
  body('animalType')   .notEmpty().withMessage('animalType is required'),
  body('locationName') .notEmpty().withMessage('locationName is required'),
  body('latitude')     .isFloat({ min: -90,  max: 90  }).withMessage('Invalid latitude'),
  body('longitude')    .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
];

router.get  ('/',           controller.getAll);
router.get  ('/stats',      controller.getStats);
router.get  ('/:id',        controller.getById);
router.post ('/', createRules, controller.create);
router.put  ('/:id/status', controller.updateStatus);
router.delete('/:id',       controller.delete);

module.exports = router;
