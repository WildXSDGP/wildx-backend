require('dotenv').config();
const app          = require('./app');
const verifyConnection = require('./db/migrate');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await verifyConnection();

    app.listen(PORT, () => {
      console.log(`\n🚀  WildX SOS API  →  http://localhost:${PORT}`);
      console.log(`🗄️   Database       →  Neon PostgreSQL`);
      console.log(`\n📡  API Endpoints:`);
      console.log(`    GET    /api/health`);
      console.log(`    GET    /api/contacts`);
      console.log(`    POST   /api/contacts`);
      console.log(`    PUT    /api/contacts/:id`);
      console.log(`    DELETE /api/contacts/:id`);
      console.log(`    POST   /api/sos/alert`);
      console.log(`    GET    /api/sos/alerts`);
      console.log(`    PATCH  /api/sos/alerts/:id/status`);
      console.log(`    GET    /api/safety-tips`);
      console.log(`    POST   /api/safety-tips`);
      console.log(`    DELETE /api/safety-tips/:id`);
      console.log(`    POST   /api/location/update`);
      console.log(`    GET    /api/location/history/:userId\n`);
    });
  } catch (err) {
    process.exit(1);
  }
}

start();
