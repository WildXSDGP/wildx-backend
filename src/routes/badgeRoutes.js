const express   = require('express');
const router    = express.Router();
const BadgeCtrl = require('../controllers/badgeController');

// GET    /api/badges/user/:user_id  → all badges for a user (AchievementGrid)
router.get('/user/:user_id',      BadgeCtrl.getByUser);

// POST   /api/badges                → create a new badge for a user
router.post('/',                   BadgeCtrl.create);

// PATCH  /api/badges/:id/earn       → mark badge as earned
router.patch('/:id/earn',          BadgeCtrl.markEarned);

// DELETE /api/badges/:id            → delete a badge
router.delete('/:id',              BadgeCtrl.delete);

module.exports = router;
