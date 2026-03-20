// src/controllers/photoController.js
/**
 * PHOTO CONTROLLER
 * Handles the logic for the community photo gallery.
 * This is where users share their wildlife sightings from different parks.
 */

const WildlifePhoto = require('../models/WildlifePhoto');

/**
 * CLEAN DATA FORMATTER:
 * Just like in the Animal Controller, this helper function ensures 
 * that we only send the necessary fields to Flutter. 
 * It keeps the response light and fast.
 */
function formatPhoto(photo) {
  const d = photo.get ? photo.get({ plain: true }) : photo;
  return {
    id:         d.id,
    imageUrl:   d.imageUrl,
    animalType: d.animalType,
    parkName:   d.parkName,
    uploadedBy: d.uploadedBy,
    uploadedAt: d.uploadedAt,
  };
}

// ── API FUNCTIONS ────────────────────────────────────────────────────────────

/**
 * GET ALL PHOTOS:
 * Fetches photos for the main PhotoGrid in Flutter.
 * It allows filtering by Animal Type (e.g., Leopard) or Park (e.g., Kumana).
 */
const getAllPhotos = async (req, res) => {
  try {
    const { animalType, parkName } = req.query;
    const where = {};

    // Filter by the type of animal if 'All' isn't selected
    if (animalType && animalType !== 'All') where.animalType = animalType;

    // Filter by the specific National Park
    if (parkName && parkName !== 'All') where.parkName = parkName;

    const photos = await WildlifePhoto.findAll({
      where,
      order: [['uploadedAt', 'DESC']], // Shows the newest photos first
    });

    res.json(photos.map(formatPhoto));
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch gallery: ' + err.message });
  }
};

/**
 * GET PHOTOS BY USER:
 * Used for the "My Uploads" or "Profile" screen in the app.
 * Shows only the photos uploaded by a specific user.
 */
const getPhotosByUser = async (req, res) => {
  try {
    const photos = await WildlifePhoto.findAll({
      where: { uploadedBy: req.params.uploadedBy },
      order: [['uploadedAt', 'DESC']],
    });
    res.json(photos.map(formatPhoto));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPLOAD PHOTO:
 * This is triggered when a user clicks the "Share Photo" button in Flutter.
 * It saves the image link and details to our Neon Database.
 */
const uploadPhoto = async (req, res) => {
  try {
    const { imageUrl, animalType, parkName, uploadedBy } = req.body;

    /** * BASIC VALIDATION:
     * We make sure all fields are filled before saving. 
     * If something is missing, we send a 400 (Bad Request) error.
     */
    if (!imageUrl || !animalType || !parkName || !uploadedBy) {
      return res.status(400).json({
        message: 'Missing info! Please provide imageUrl, animalType, parkName, and your username.',
      });
    }

    const photo = await WildlifePhoto.create({
      imageUrl,
      animalType,
      parkName,
      uploadedBy,
      uploadedAt: new Date(), // Automatically sets the current time
    });

    // Send back the newly created photo data to Flutter
    res.status(201).json(formatPhoto(photo));
  } catch (err) {
    res.status(500).json({ message: 'Upload failed: ' + err.message });
  }
};

/**
 * DELETE PHOTO:
 * Allows a user to remove their own photo from the gallery.
 */
const deletePhoto = async (req, res) => {
  try {
    const photo = await WildlifePhoto.findByPk(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found!' });
    }

    await photo.destroy();
    res.status(204).send(); // 204 means "Success, but no content to send back"
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllPhotos,
  getPhotosByUser,
  uploadPhoto,
  deletePhoto,
};