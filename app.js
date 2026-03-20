const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const rangerRoutes  = require('./src/routes/rangerRoutes');
const badgeRoutes   = require('./src/routes/badgeRoutes');
const parkRoutes    = require('./src/routes/parkRoutes');

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'WildX API is running 🌿' });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/rangers',  rangerRoutes);
app.use('/api/badges',   badgeRoutes);
app.use('/api/parks',    parkRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

module.exports = app;
