// src/index.js
/**
 * WILDX SERVER ENTRY POINT (Updated)
 * This is the main "Power Button" for our backend.
 * Now it handles both Animal Gallery data and the new Notification system.
 */

require('dotenv').config();

const app                = require('../app'); 
const sequelize          = require('./config/database');
const seedAnimalData      = require('./seeders/animalSeeder');

// NEW: Importing the Notification Seeder to populate sample alerts
const seedNotificationData = require('./seeders/notificationSeeder'); 

/**
 * IMPORTANT:
 * We import the Notification model here so Sequelize knows 
 * to create the 'notifications' table during the sync process.
 */
require('./models/Notification'); 

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    // ── STEP 1: Database Handshake ──────────────────────────────────────────
    // Checking if our connection to Neon PostgreSQL is working.
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // ── STEP 2: Syncing the Blueprint ───────────────────────────────────────
    /**
     * { alter: true } ensures our SQL tables match our Node.js models.
     * If we added 'isRead' or 'isDeleted' fields, it updates the DB automatically.
     */
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced with database');

    // ── STEP 3: Population (Seeding) ────────────────────────────────────────
    // Adds the 8 species to the gallery if the table is empty.
    await seedAnimalData();

    // NEW: Adds the sample notifications (Welcome, Sightings, etc.) if empty.
    await seedNotificationData();

    // ── STEP 4: Start Listening ─────────────────────────────────────────────
    // Everything is ready! Now we start the Express server.
    app.listen(PORT, () => {
      console.log('\n──────────────────────────────────────────────');
      console.log(`🚀 WildX Gallery API is LIVE!`);
      console.log(`    Health:        http://localhost:${PORT}/health`);
      console.log(`    Animals:       http://localhost:${PORT}/api/v1/animals`);
      console.log(`    Photos:        http://localhost:${PORT}/api/v1/photos`);
      console.log(`    Notifications: http://localhost:${PORT}/api/v1/notifications`);
      console.log('──────────────────────────────────────────────\n');
    });

  } catch (error) {
    // Error handling if the database connection or server startup fails.
    console.error('❌ Server failed to start:', error.message);
    process.exit(1); 
  }
}

// Kick off the startup sequence!
startServer();