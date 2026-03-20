const express = require('express');
const cors    = require('cors');
const app     = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',  require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// ── Root ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'WildX API 🦁', version: '1.0.0' });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
