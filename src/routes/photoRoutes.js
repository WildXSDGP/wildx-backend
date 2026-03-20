// src/routes/photoRoutes.js
/**
 * COMMUNITY PHOTO ROUTES
 * This file maps the URLs for the community gallery.
 * It connects the Flutter app's photo actions to the logic in photoController.
 */

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/photoController');

/**
 * URL: GET /api/v1/photos
 * Purpose: Fetches all community photos for the main grid.
 * Supports filters like: /photos?animalType=Elephant&parkName=Yala
 */
router.get('/', controller.getAllPhotos);

/**
 * URL: GET /api/v1/photos/user/:uploadedBy
 * Purpose: Fetches photos uploaded by a specific user for their profile.
 * NOTE: We place '/user' before '/:id' so Express doesn't confuse 
 * the word "user" with a specific photo ID.
 */
router.get('/user/:uploadedBy', controller.getPhotosByUser);

/**
 * URL: POST /api/v1/photos
 * Purpose: Triggered when a user clicks "Share Photo" in the app.
 * This creates a new entry in our Neon Database.
 */
router.post('/', controller.uploadPhoto);

/**
 * URL: DELETE /api/v1/photos/:id
 * Purpose: Allows a user to remove their own photo sighting from the gallery.
 */
router.delete('/:id', controller.deletePhoto);

module.exports = router;