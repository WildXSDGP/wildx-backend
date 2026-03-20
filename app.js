// app.js
/**
 * THE EXPRESS APPLICATION (Updated)
 * This is the heart of our API. We've now added the Notification 
 * module so the app can handle alerts, sightings, and system updates.
 */

require('dotenv').config();

const express            = require('express');
const cors               = require('cors');
const animalRoutes       = require('./src/routes/animalRoutes');
const photoRoutes        = require('./src/routes/photoRoutes');

// NEW: Importing the Notification pathways
const notificationRoutes = require('./src/routes/notificationRoutes'); 

const app = express();

// ── MIDDLEWARE (Security & Data Parsing) ──────────────────────────────────────

/**
 * CORS SETUP:
 * Essential for Flutter! It tells the server to allow requests 
 * coming from your mobile emulator or physical device.
 */
app.use(cors({
  origin:         '*',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * BODY PARSERS:
 * These lines allow Express to read the data (JSON or URL-encoded) 
 * sent from the Flutter app during POST or PATCH requests.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
/**
 * Use http://localhost:8080/health to quickly check if the server is alive.
 */
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'WildX Gallery API', version: '1.0.0' });
});

// ── MAIN API ROUTES ───────────────────────────────────────────────────────────
/**
 * Here we register our main features. 
 * Any request to /api/v1/notifications will now be handled by our new routes.
 */
app.use('/api/v1/animals',       animalRoutes);
app.use('/api/v1/photos',        photoRoutes);
app.use('/api/v1/notifications', notificationRoutes); // Now Live!

// ── 404 HANDLER (Route Not Found) ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    message: `Oops! Route ${req.method} ${req.originalUrl} not found in WildX API`,
  });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
/**
 * Our safety net. If anything crashes in the routes, this sends 
 * a clean JSON error message back to the Flutter app.
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