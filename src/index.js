// src/index.js
/**
 * WILDX SERVER ENTRY POINT
 * This is the main file that starts the entire backend.
 * It connects to Neon, prepares the database tables, and launches the server.
 */

require('dotenv').config();

const app           = require('../app'); // Imports the Express app settings
const sequelize     = require('./config/database'); // Imports our DB connection
const seedAnimalData = require('./seeders/animalSeeder'); // Imports the initial data tool

const PORT = process.env.PORT || 8080;

/**
 * START SERVER FUNCTION:
 * We use an 'async' function to make sure each step finishes 
 * before the next one starts.
 */
async function startServer() {
  try {
    // ── STEP 1: Test the Connection ──────────────────────────────────────────
    // Checks if our .env file has the right info to talk to Neon PostgreSQL.
    console.log('🔌 Connecting to Neon PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // ── STEP 2: Sync Database Tables ─────────────────────────────────────────
    /**
     * { alter: true } is a lifesaver! 
     * It checks if the table matches our Node.js model. 
     * If we added a new field, it adds it to the DB without deleting any old data.
     */
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced with the database');

    // ── STEP 3: Initial Data Setup ───────────────────────────────────────────
    // Fills the database with our 8 default animals if the table is empty.
    await seedAnimalData();

    // ── STEP 4: Launch the API ───────────────────────────────────────────────
    // Now that the DB is ready, we let the server start listening for requests.
    app.listen(PORT, () => {
      console.log('\n──────────────────────────────────────────');
      console.log(`🚀 WildX Gallery API is LIVE!`);
      console.log(`    Health:  http://localhost:${PORT}/health`);
      console.log(`    Animals: http://localhost:${PORT}/api/v1/animals`);
      console.log(`    Photos:  http://localhost:${PORT}/api/v1/photos`);
      console.log('──────────────────────────────────────────\n');
    });

  } catch (error) {
    // ── ERROR HANDLING ───────────────────────────────────────────────────────
    console.error('❌ Server failed to start:', error.message);
    
    // Specifically help if the connection string is missing
    if (error.message.includes('DATABASE_URL')) {
      console.error('💡 TIP: Check if you added DATABASE_URL to your .env file');
    }
    
    process.exit(1); // Stop everything if the server can't start properly
  }
}

// Kick off the startup process
startServer();