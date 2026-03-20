const express    = require('express');
const router     = express.Router();
const UserCtrl   = require('../controllers/userController');

// GET    /api/users              → list all users
router.get('/',                  UserCtrl.getAll);

// GET    /api/users/:id          → get user + badges[] + top_parks[]
router.get('/:id',               UserCtrl.getById);

// POST   /api/users              → create new user
router.post('/',                 UserCtrl.create);

// PUT    /api/users/:id          → update profile (name/email/location/bio)
router.put('/:id',               UserCtrl.update);

// PATCH  /api/users/:id/xp       → update xp + current_level
router.patch('/:id/xp',          UserCtrl.updateXP);

// PATCH  /api/users/:id/stat     → increment sightings/parks/photos counter
router.patch('/:id/stat',        UserCtrl.incrementStat);

// DELETE /api/users/:id          → delete user (cascades badges + parks)
router.delete('/:id',            UserCtrl.delete);

module.exports = router;
