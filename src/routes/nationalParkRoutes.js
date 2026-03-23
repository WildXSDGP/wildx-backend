// src/routes/nationalParkRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/nationalParkController');

// Static routes first
router.get('/search', ctrl.searchByAnimal);   // GET /api/national-parks/search?animal=Leopard
router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      ctrl.create);
router.put('/:id',    ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;