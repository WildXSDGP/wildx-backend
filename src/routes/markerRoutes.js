// src/routes/markerRoutes.js
// Mirrors Spring Boot @RequestMapping("/markers")
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/markerController');


// ── Park-scoped routes (MUST come before /:markerId) ─────────
router.get('/park/:parkId',               ctrl.getByPark);
router.get('/park/:parkId/type',          ctrl.getByParkAndType);
router.get('/park/:parkId/verified',      ctrl.getVerifiedByPark);
router.get('/park/:parkId/animal-types',  ctrl.getAnimalTypesInPark);
router.get('/park/:parkId/counts',        ctrl.getCountsByAnimalType);
router.get('/park/:parkId/recent',        ctrl.getRecentByPark);
router.get('/park/:parkId/bounds',        ctrl.getInBounds);


// ── Global routes ─────────────────────────────────────────────
router.get('/unverified',                 ctrl.getUnverified);