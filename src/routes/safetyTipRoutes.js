const express = require('express');
const router  = express.Router();
const { getTips, createTip, deleteTip } =
  require('../controllers/safetyTipController');

router.get('/',       getTips);
router.post('/',      createTip);
router.delete('/:id', deleteTip);

module.exports = router;
