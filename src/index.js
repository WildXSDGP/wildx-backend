const app = require('../app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('');
  console.log('  🌿  WildX API');
  console.log(`  ✅  Running  →  http://localhost:${PORT}`);
  console.log(`  🗄️   Database →  Neon PostgreSQL`);
  console.log(`  🌍  Mode     →  ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});
