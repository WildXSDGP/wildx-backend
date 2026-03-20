const express  = require('express');
const router   = express.Router();
const ParkCtrl = require('../controllers/parkController');

// GET    /api/parks/user/:user_id  → all parks for a user (TopParksCard)
router.get('/user/:user_id',      ParkCtrl.getByUser);

// POST   /api/parks                → add a new park visit record
router.post('/',                   ParkCtrl.create);

// PATCH  /api/parks/:id/visit      → increment visit_count by 1
router.patch('/:id/visit',         ParkCtrl.incrementVisit);

// PUT    /api/parks/:id            → update park_name or visit_count
router.put('/:id',                 ParkCtrl.update);

// DELETE /api/parks/:id            → delete park record
router.delete('/:id',              ParkCtrl.delete);

module.exports = router;
