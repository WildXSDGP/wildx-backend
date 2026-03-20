// src/seeders/animalSeeder.js
/**
 * WILDLIFE ANIMAL SEEDER
 * This file is like a "Quick Start" tool for your database.
 * It automatically fills the Neon PostgreSQL table with initial data 
 * so you don't have to add animals manually one by one.
 */

const WildlifeAnimal = require('../models/WildlifeAnimal');

/**
 * DEFAULT DATA:
 * These are the 8 animals from your Flutter 'gallery_data.dart'.
 * We use the exact same IDs and names to keep the frontend and backend in sync.
 */
const seedAnimals = [
  { id:'1', name:'Sri Lankan Leopard',    scientificName:'Panthera pardus kotiya',    category:'Mammals',  parkLocation:'Yala National Park',      status:'Endangered',    emoji:'🐆', isFavorite:false },
  { id:'2', name:'Asian Elephant',        scientificName:'Elephas maximus',            category:'Mammals',  parkLocation:'Minneriya National Park',  status:'Endangered',    emoji:'🐘', isFavorite:false },
  { id:'3', name:'Sri Lankan Sloth Bear', scientificName:'Melursus ursinus inornatus', category:'Mammals',  parkLocation:'Wilpattu National Park',   status:'Vulnerable',    emoji:'🐻', isFavorite:false },
  { id:'4', name:'Peacock',               scientificName:'Pavo cristatus',             category:'Birds',    parkLocation:'Udawalawe National Park',  status:'Least Concern', emoji:'🦚', isFavorite:false },
  { id:'5', name:'Purple-faced Langur',   scientificName:'Trachypithecus vetulus',     category:'Mammals',  parkLocation:'Sinharaja Forest',         status:'Endangered',    emoji:'🐒', isFavorite:false },
  { id:'6', name:'Mugger Crocodile',      scientificName:'Crocodylus palustris',        category:'Reptiles', parkLocation:'Yala National Park',        status:'Vulnerable',    emoji:'🐊', isFavorite:false },
  { id:'7', name:'Sri Lanka Junglefowl',  scientificName:'Gallus lafayettii',           category:'Birds',    parkLocation:'Horton Plains',             status:'Least Concern', emoji:'🐓', isFavorite:false },
  { id:'8', name:'Indian Cobra',          scientificName:'Naja naja',                  category:'Reptiles', parkLocation:'Bundala National Park',    status:'Least Concern', emoji:'🐍', isFavorite:false },
];

/**
 * SEEDING LOGIC:
 * This function runs when the server starts.
 */
async function seedAnimalData() {
  try {
    // 1. First, check if there is already data in the 'wildlife_animal' table
    const count = await WildlifeAnimal.count();

    if (count === 0) {
      // 2. If the table is empty, we "bulk create" (insert) all 8 animals at once
      await WildlifeAnimal.bulkCreate(seedAnimals, { ignoreDuplicates: true });
      console.log('✅ Success: Seeded 8 wildlife animals into the database');
    } else {
      // 3. If data already exists, we skip this to avoid duplicating the same animals
      console.log(`ℹ️  Database already has ${count} animals — skipping seed process`);
    }
  } catch (err) {
    // Error handling in case the database connection fails
    console.error('❌ Seeder failed to run:', err.message);
    throw err;
  }
}

module.exports = seedAnimalData;