const express = require('express');
const router  = express.Router();
const { updateLocation, getLocationHistory } =
  require('../controllers/locationController');

router.post('/update',         updateLocation);
router.get('/history/:userId', getLocationHistory);

module.exports = router;
