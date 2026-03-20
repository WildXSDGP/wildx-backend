const express    = require('express');
const controller = require('../controllers/animalController');

const router = express.Router();

router.get('/', controller.getAll);

module.exports = router;
