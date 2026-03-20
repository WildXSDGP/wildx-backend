// src/config/database.js
// Sequelize connection to Neon PostgreSQL

/**
 * 1. Load environment variables from .env file.
 * 2. Import Sequelize to handle Database ORM (Object-Relational Mapping).
 */
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Grab the secret connection string for Neon Postgres
const DATABASE_URL = process.env.DATABASE_URL;

/** * ERROR CHECK:
 * We stop the app immediately if the URL is missing. 
 * This prevents "undefined" connection errors later.
 */
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from your .env file');
}

/**
 * CREATE SEQUELIZE INSTANCE:
 * This object will be used throughout the app to talk to the database.
 */
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',

  // SSL (Secure Sockets Layer) is mandatory for Neon cloud databases
  dialectOptions: {
    ssl: {
      require:            true,
      rejectUnauthorized: false, // Helps bypass local certificate issues
    },
  },

  /** * LOGGING:
   * We only want to see the SQL commands in our terminal while we are building (Development).
   * In Production (Live), we turn it off to keep the logs clean and fast.
   */
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  /**
   * CONNECTION POOLING:
   * Neon's free tier has a limit on how many people can connect at once.
   * We set 'max: 5' to ensure we don't exceed those limits and crash the DB.
   */
  pool: {
    max:     5,     // Maximum 5 open connections at a time
    min:     0,     // Close all connections if no one is using the app
    acquire: 30000, // Wait 30 seconds for a connection before giving up
    idle:    10000, // Close a connection if it's been sitting idle for 10 seconds
  },
});

// Export it so our Models (User, Animal, etc.) can use this connection
module.exports = sequelize;