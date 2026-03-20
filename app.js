// app.js
/**
 * THE EXPRESS APPLICATION CONFIGURATION
 * This file sets up the middleware, security rules, and main route paths.
 * It's the "Middleman" between the raw server and your actual logic.
 */

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const animalRoutes = require('./src/routes/animalRoutes');
const photoRoutes  = require('./src/routes/photoRoutes');

const app = express();

// ── MIDDLEWARE (The Gatekeepers) ──────────────────────────────────────────────

/**
 * CORS (Cross-Origin Resource Sharing):
 * This is CRITICAL for Flutter. By default, browsers/simulators block 
 * requests from different 'origins'. Setting this to '*' allows your 
 * Flutter app (Android/iOS) to talk to this Node.js API without errors.
 */
app.use(cors({
  origin:         '*',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * JSON PARSER:
 * When you upload a photo from Flutter, the data comes as a JSON object.
 * This line allows Express to "read" that JSON so we can use it in our code.
 */
app.use(express.json());

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
/**
 * Simple 'ping' to see if the server is alive. 
 * If you go to http://localhost:8080/health and see "UP", everything is working!
 */
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'WildX Gallery API', version: '1.0.0' });
});

// ── WILDX ROUTES (The Main Pathways) ──────────────────────────────────────────
/**
 * We map our specific logic files to cleaner URLs.
 * Anything starting with /api/v1/animals goes to animalRoutes.
 */
app.use('/api/v1/animals', animalRoutes);
app.use('/api/v1/photos',  photoRoutes);

// ── 404 HANDLER (The "Not Found" logic) ───────────────────────────────────────
/**
 * If the Flutter app tries to call a URL that doesn't exist, 
 * this sends back a clear error message instead of a messy HTML page.
 */
app.use((req, res) => {
  res.status(404).json({
    message: `Sorry! The route ${req.method} ${req.originalUrl} was not found.`,
  });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
/**
 * If our code crashes somewhere, this "Safety Net" catches the error.
 * It prevents the whole server from dying and sends a professional 
 * JSON error back to the app.
 */
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    message:   err.message || 'An unexpected error occurred on the server',
  });
});

module.exports = app;