// src/controllers/animalController.js
/**
 * WILDX ANIMAL CONTROLLER
 * This file handles all the logic for wildlife data. 
 * It talks to the Database so the Routes stay clean and simple.
 */

const { Op }         = require('sequelize');
const WildlifeAnimal = require('../models/WildlifeAnimal');

// ── UI HELPERS ──────────────────────────────────────────────────────────────
/**
 * These helpers mirror your Flutter code logic. 
 * We send the colors directly from the backend so the app always 
 * displays the correct 'Danger Level' for each animal.
 */
function getStatusColor(status) {
  switch (status) {
    case 'Endangered': return '#E53935'; // Red
    case 'Vulnerable': return '#FF9800'; // Orange
    default:            return '#2ECC71'; // Green (Safe)
  }
}

function getStatusBgColor(status) {
  switch (status) {
    case 'Endangered': return '#FFEBEE';
    case 'Vulnerable': return '#FFF3E0';
    default:            return '#E8F5E9';
  }
}

/**
 * CLEAN DATA FORMATTER:
 * Sequelize objects contain a lot of extra "meta data." 
 * This function strips that away and returns a clean JSON object 
 * that the Flutter app can easily understand.
 */
function formatAnimal(animal) {
  const d = animal.get ? animal.get({ plain: true }) : animal;
  return {
    id:             d.id,
    name:           d.name,
    scientificName: d.scientificName,
    category:       d.category,
    parkLocation:   d.parkLocation,
    status:         d.status,
    emoji:          d.emoji,
    isFavorite:     d.isFavorite,
    statusColor:    getStatusColor(d.status),
    statusBgColor:  getStatusBgColor(d.status),
  };
}

// ── API FUNCTIONS ────────────────────────────────────────────────────────────

/**
 * GET ALL ANIMALS:
 * Fetches animals from the database. It handles:
 * 1. Search (by name, science name, or park)
 * 2. Category filtering (e.g., Mammals, Birds)
 * 3. Park filtering (e.g., Yala, Wilpattu)
 */
const getAllAnimals = async (req, res) => {
  try {
    const { search, category, park } = req.query;
    const where = {};

    // If the user types in the search bar
    if (search && search.trim()) {
      const pattern = `%${search.trim()}%`; // Case-insensitive partial match
      where[Op.or] = [
        { name:           { [Op.iLike]: pattern } },
        { scientificName: { [Op.iLike]: pattern } },
        { parkLocation:   { [Op.iLike]: pattern } },
      ];
    }

    // Filter by category if one is selected (and it's not 'All')
    if (category && category !== 'All') {
      where.category = category;
    }

    // Filter by National Park
    if (park && park !== 'All') {
      where.parkLocation = park;
    }

    const animals = await WildlifeAnimal.findAll({
      where,
      order: [['name', 'ASC']], // Sort alphabetically
    });

    res.json(animals.map(formatAnimal));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching animals: ' + err.message });
  }
};

/**
 * GET CATEGORIES:
 * Scans the database and returns a unique list of animal categories.
 * This is used to build the filter chips in the app dynamically.
 */
const getCategories = async (req, res) => {
  try {
    const rows = await WildlifeAnimal.findAll({
      attributes: ['category'],
      group:      ['category'],
      order:      [['category', 'ASC']],
    });
    res.json(['All', ...rows.map(r => r.category)]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET PARKS:
 * Returns a unique list of park names. If you add a new park 
 * to the DB, it will automatically show up in the app's filter bar!
 */
const getParks = async (req, res) => {
  try {
    const rows = await WildlifeAnimal.findAll({
      attributes: ['parkLocation'],
      group:      [['park_location', 'parkLocation']],
      order:      [['parkLocation', 'ASC']],
    });
    res.json(['All', ...rows.map(r => r.parkLocation)]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * TOGGLE FAVORITE:
 * When a user taps the "Heart" icon in Flutter, this function 
 * flips the 'isFavorite' status in the database.
 */
const toggleFavorite = async (req, res) => {
  try {
    const animal = await WildlifeAnimal.findByPk(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    // Flip the boolean value (true -> false / false -> true)
    await animal.update({ isFavorite: !animal.isFavorite });
    res.json(formatAnimal(animal));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET FAVORITES:
 * Fetches all animals where 'isFavorite' is true.
 * Used for the "My Favorites" list in the app.
 */
const getFavorites = async (req, res) => {
  try {
    const animals = await WildlifeAnimal.findAll({
      where: { isFavorite: true },
      order: [['name', 'ASC']],
    });
    res.json(animals.map(formatAnimal));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ANIMAL BY ID:
 * Fetches one single animal using its ID (e.g., 'A001').
 */
const getAnimalById = async (req, res) => {
  try {
    const animal = await WildlifeAnimal.findByPk(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }

    res.json(formatAnimal(animal));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAnimals,
  getCategories,
  getParks,
  getFavorites,
  getAnimalById,
  toggleFavorite,
};