require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const sightingRoutes = require('./src/routes/sightingRoutes');
const animalRoutes   = require('./src/routes/animalRoutes');
const { testConnection } = require('./src/models/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/sightings', sightingRoutes);
app.use('/api/animals',   animalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🚀 Wildlife Tracker API running on port ${PORT}`);
  await testConnection();
});

module.exports = app;
