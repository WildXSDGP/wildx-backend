require('dotenv').config();
const admin    = require('firebase-admin');
const { initDB } = require('./src/models/db');
const app      = require('./app');

const PORT = process.env.PORT || 3000;

// ── Firebase Admin Init ────────────────────────────────────
// ⚠️ Place firebase-service-account.json in root folder
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT || './firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('✅ Firebase Admin initialized');
}

// ── Start Server ───────────────────────────────────────────
const startServer = async () => {
  await initDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 WildX Backend running on http://localhost:${PORT}`);
    console.log(`📋 Health:  http://localhost:${PORT}/api/auth/health`);
    console.log(`📝 Register: POST http://localhost:${PORT}/api/auth/register`);
    console.log(`🔐 Login:    POST http://localhost:${PORT}/api/auth/login`);
    console.log(`👥 Users:    GET  http://localhost:${PORT}/api/users\n`);
  });
};

startServer();
