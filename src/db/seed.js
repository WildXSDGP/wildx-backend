/**
 * WildX — Database Seed
 * Inserts sample data that exactly matches kSampleUser from sample_user.dart.
 *
 * Run:  npm run db:seed
 */

const { query } = require('./db');

async function seed() {
  console.log('\n🌱  WildX — Seeding Neon database...\n');

  // ── Insert user (matches kSampleUser exactly) ─────────────────
  const userRes = await query(`
    INSERT INTO users (
      name, email, profile_image_url, location, bio,
      member_since, sightings_count, parks_visited,
      photos_count, xp, current_level
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8,
      $9, $10, $11
    )
    ON CONFLICT (email) DO UPDATE SET
      name              = EXCLUDED.name,
      location          = EXCLUDED.location,
      bio               = EXCLUDED.bio,
      sightings_count   = EXCLUDED.sightings_count,
      parks_visited     = EXCLUDED.parks_visited,
      photos_count      = EXCLUDED.photos_count,
      xp                = EXCLUDED.xp,
      current_level     = EXCLUDED.current_level
    RETURNING id, name;
  `, [
    'Safari Explorer',
    'safari.explorer@wildx.app',
    null,                     // profileImageUrl = null
    'Colombo, Sri Lanka',
    'Wildlife enthusiast & nature photographer. Yala is home.',
    '2024-11-01',             // memberSince
    28,                       // sightingsCount
    7,                        // parksVisited
    142,                      // photosCount
    450,                      // xp
    'ranger',                 // currentLevel
  ]);

  const userId = userRes.rows[0].id;
  console.log(`  ✅  User inserted   → id: ${userId}  name: "${userRes.rows[0].name}"`);

  // ── Clear old seed data ──────────────────────────────────────
  await query(`DELETE FROM badges      WHERE user_id = $1`, [userId]);
  await query(`DELETE FROM park_visits WHERE user_id = $1`, [userId]);

  // ── Insert badges (matches Flutter BadgeModel list) ───────────
  const badges = [
    { title: 'First Sighting',  icon: 'assets/icons/badge_first_sighting.png', earned: true  },
    { title: '10 Sightings',    icon: 'assets/icons/badge_trophy.png',          earned: true  },
    { title: 'Photo Master',    icon: 'assets/icons/badge_photo.png',            earned: true  },
    { title: '5 Parks Visited', icon: 'assets/icons/badge_park.png',             earned: true  },
    { title: 'Night Safari',    icon: 'assets/icons/badge_night.png',            earned: false },
    { title: 'Leopard Spotter', icon: 'assets/icons/badge_leopard.png',          earned: false },
  ];

  for (const b of badges) {
    await query(`
      INSERT INTO badges (user_id, title, icon_asset, earned, earned_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, b.title, b.icon, b.earned, b.earned ? new Date() : null]);
  }
  console.log(`  ✅  Badges inserted → ${badges.length} rows`);

  // ── Insert park_visits (matches Flutter ParkVisit list) ───────
  const parks = [
    { name: 'Yala National Park', visits: 12 },
    { name: 'Udawalawe',          visits: 8  },
    { name: 'Wilpattu',           visits: 5  },
  ];

  for (const p of parks) {
    await query(`
      INSERT INTO park_visits (user_id, park_name, visit_count, last_visited)
      VALUES ($1, $2, $3, NOW())
    `, [userId, p.name, p.visits]);
  }
  console.log(`  ✅  Parks inserted  → ${parks.length} rows`);

  console.log('\n  🎉  Seed complete!\n');
  process.exit(0);
}

seed().catch((err) => {
  console.error('\n  ❌  Seed failed:', err.message, '\n');
  process.exit(1);
});
