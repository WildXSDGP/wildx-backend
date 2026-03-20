// src/models/WildlifeAnimal.js
/**
 * WILDLIFE ANIMAL MODEL
 * This file defines how an "Animal" looks in our Neon Database.
 * It mirrors the 'wildlife_animal.dart' file from your Flutter app 
 * so the frontend and backend stay perfectly in sync.
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const WildlifeAnimal = sequelize.define(
  'WildlifeAnimal',
  {
    /** * UNIQUE ID:
     * Matches the ID in your Flutter gallery_data.dart.
     * We use STRING(10) to support custom IDs like 'A001'.
     */
    id: {
      type:       DataTypes.STRING(10),
      primaryKey: true,
      allowNull:  false,
    },

    /** * COMMON NAME:
     * The name shown on the Animal Cards (e.g., "Leopard").
     */
    name: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },

    /** * SCIENTIFIC NAME:
     * The Latin name shown in italics. 
     * Note: We use 'field' to map it to 'scientific_name' in the SQL table.
     */
    scientificName: {
      type:      DataTypes.STRING(150),
      allowNull: false,
      field:     'scientific_name', 
    },

    /** * CATEGORY:
     * Used for the filter chips (Mammals, Birds, etc.).
     */
    category: {
      type:      DataTypes.STRING(50),
      allowNull: false,
    },

    /** * PARK LOCATION:
     * The national park where this animal is commonly found (e.g., Yala).
     */
    parkLocation: {
      type:      DataTypes.STRING(150),
      allowNull: false,
      field:     'park_location',
    },

    /** * CONSERVATION STATUS:
     * Important for the status badge colors (Endangered, Vulnerable, etc.).
     */
    status: {
      type:      DataTypes.STRING(50),
      allowNull: false,
    },

    /** * EMOJI:
     * Used as a fun fallback image while the real photo is loading.
     */
    emoji: {
      type:      DataTypes.STRING(10),
      allowNull: false,
    },

    /** * FAVORITE TOGGLE:
     * Tracks if the user has "hearted" this animal.
     * Starts as 'false' by default.
     */
    isFavorite: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
      field:        'is_favorite',
    },
  },
  {
    // Tells Sequelize exactly which table to look for in Neon
    tableName:  'wildlife_animal', 
    
    // We disable timestamps because we don't need 'createdAt' or 'updatedAt' for this table
    timestamps: false,
  }
);

module.exports = WildlifeAnimal;