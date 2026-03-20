/**
 * WildX — Database Migration
 * Creates all tables on Neon PostgreSQL.
 *
 * Tables:
 *   users        → matches Flutter UserModel
 *   badges       → matches Flutter BadgeModel
 *   park_visits  → matches Flutter ParkVisit
 *
 * Run:  npm run db:migrate
 */

const { query } = require('./db');

async function migrate() {
  console.log('\n🚀  WildX — Running database migration on Neon...\n');

  // ─────────────────────────────────────────────────────────────
  // TABLE: users
  // Maps to Flutter UserModel:
  //   name, profileImageUrl, memberSince,
  //   sightingsCount, parksVisited, photosCount,
  //   xp, currentLevel, email, location, bio
  // ─────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id                SERIAL        PRIMARY KEY,
      name              VARCHAR(100)  NOT NULL,
      email             VARCHAR(150)  UNIQUE,
      profile_image_url TEXT,
      location          VARCHAR(150),
      bio               TEXT,
      member_since      DATE          NOT NULL DEFAULT CURRENT_DATE,

      -- Stats (TrackerCard widget)
      sightings_count   INT           NOT NULL DEFAULT 0 CHECK (sightings_count >= 0),
      parks_visited     INT           NOT NULL DEFAULT 0 CHECK (parks_visited >= 0),
      photos_count      INT           NOT NULL DEFAULT 0 CHECK (photos_count >= 0),

      -- XP & Level (LevelCard / XPProgressCard widget)
      xp                INT           NOT NULL DEFAULT 0 CHECK (xp >= 0),
      current_level     VARCHAR(20)   NOT NULL DEFAULT 'explorer'
                          CHECK (current_level IN ('explorer', 'ranger', 'guardian')),

      created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `);
  console.log('  ✅  Table: users');

  // ─────────────────────────────────────────────────────────────
  // TABLE: badges
  // Maps to Flutter BadgeModel:
  //   title, iconAsset, earned
  // ─────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS badges (
      id          SERIAL        PRIMARY KEY,
      user_id     INT           NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
      title       VARCHAR(100)  NOT NULL,
      icon_asset  VARCHAR(255)  NOT NULL,
      earned      BOOLEAN       NOT NULL DEFAULT FALSE,
      earned_at   TIMESTAMPTZ,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `);
  console.log('  ✅  Table: badges');

  // ─────────────────────────────────────────────────────────────
  // TABLE: park_visits
  // Maps to Flutter ParkVisit:
  //   parkName, visitCount
  // ─────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS park_visits (
      id           SERIAL        PRIMARY KEY,
      user_id      INT           NOT NULL
                     REFERENCES users(id) ON DELETE CASCADE,
      park_name    VARCHAR(150)  NOT NULL,
      visit_count  INT           NOT NULL DEFAULT 1 CHECK (visit_count >= 1),
      last_visited DATE,
      created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );
  `);
  console.log('  ✅  Table: park_visits');

  // ─────────────────────────────────────────────────────────────
  // INDEXES — speed up common Flutter queries
  // ─────────────────────────────────────────────────────────────
  await query(`CREATE INDEX IF NOT EXISTS idx_badges_user_id     ON badges(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_park_visits_user_id ON park_visits(user_id);`);
  await query(`CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);`);
  console.log('  ✅  Indexes created');

  // ─────────────────────────────────────────────────────────────
  // TRIGGER — auto-update updated_at on users & park_visits
  // ─────────────────────────────────────────────────────────────
  await query(`
    CREATE OR REPLACE FUNCTION fn_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await query(`
    DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
    CREATE TRIGGER trg_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
  `);

  await query(`
    DROP TRIGGER IF EXISTS trg_park_visits_updated_at ON park_visits;
    CREATE TRIGGER trg_park_visits_updated_at
      BEFORE UPDATE ON park_visits
      FOR EACH ROW EXECUTE FUNCTION fn_updated_at();
  `);
  console.log('  ✅  Triggers: auto updated_at');

  console.log('\n  🎉  Migration complete!\n');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('\n  ❌  Migration failed:', err.message, '\n');
  process.exit(1);
});
