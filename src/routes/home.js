const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getHomeData } = require('../controllers/homeController');

// GET /api/home  (protected — needs JWT)
router.get('/', auth, getHomeData);

module.exports = router;
