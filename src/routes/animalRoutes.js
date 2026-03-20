// src/routes/animalRoutes.js
/**
 * WILDLIFE ANIMAL ROUTES
 * This file maps the URLs (Endpoints) to the logic in our Controller.
 * It's like a menu: the app asks for a 'Path', and this file tells 
 * the app which 'Function' to run.
 */

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/animalController');

/** * ── ORDER MATTERS! ───────────────────────────────────────────────────────────
 * In Express, routes are checked from top to bottom.
 * Static routes (like /categories) MUST come before dynamic routes (like /:id).
 * Why? If /:id was first, Express would think the word "categories" is an ID!
 * ─────────────────────────────────────────────────────────────────────────────
 */

// URL: GET /api/v1/animals/categories
// Used to fill the Category Filter Chips (Mammals, Birds, etc.)
router.get('/categories', controller.getCategories);

// URL: GET /api/v1/animals/parks
// Used to fill the Park Filter Bar (Yala, Wilpattu, etc.)
router.get('/parks', controller.getParks);

// URL: GET /api/v1/animals/favorites
// Fetches all the animals the user has marked with a heart
router.get('/favorites', controller.getFavorites);

// URL: GET /api/v1/animals
// The main "Fetch" for the Gallery. 
// Can handle filters like: /animals?search=leopard&category=Mammals
router.get('/', controller.getAllAnimals);

// URL: GET /api/v1/animals/:id
// Fetches details for ONE specific animal (e.g., when opening a detail sheet)
router.get('/:id', controller.getAnimalById);

// URL: PATCH /api/v1/animals/:id/favorite
// Triggered when the user taps the heart button in Flutter to toggle "isFavorite"
router.patch('/:id/favorite', controller.toggleFavorite);

module.exports = router;