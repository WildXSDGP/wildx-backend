const express = require('express');
const router  = express.Router();
const { sendAlert, getAlerts, updateAlertStatus } =
  require('../controllers/sosAlertController');

router.post('/alert',              sendAlert);
router.get('/alerts',              getAlerts);
router.patch('/alerts/:id/status', updateAlertStatus);

module.exports = router;
