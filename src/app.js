const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────
app.use('/api/contacts',    require('./routes/emergencyContactRoutes'));
app.use('/api/sos',         require('./routes/sosAlertRoutes'));
app.use('/api/safety-tips', require('./routes/safetyTipRoutes'));
app.use('/api/location',    require('./routes/locationRoutes'));

// ── Health ────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: '🚨 WildX SOS API (Neon) is running', db: 'PostgreSQL' })
);

// ── 404 ───────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);

// ── Error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
