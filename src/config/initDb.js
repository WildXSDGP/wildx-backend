const { pool } = require('./db');
require('dotenv').config();

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('🔧 Initializing database...');

    // ── Users table ──────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        profile_image_url TEXT,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Parks table ───────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS parks (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(150) NOT NULL,
        location     VARCHAR(150) NOT NULL,
        image_url    TEXT,
        description  TEXT,
        animal_count INTEGER DEFAULT 0,
        is_featured  BOOLEAN DEFAULT FALSE,
        created_at   TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Sightings table ───────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS sightings (
        id           SERIAL PRIMARY KEY,
        animal_name  VARCHAR(100) NOT NULL,
        park_name    VARCHAR(150) NOT NULL,
        sighting_date DATE NOT NULL,
        image_url    TEXT,
        category     VARCHAR(80) NOT NULL,
        notes        TEXT,
        user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
        park_id      INTEGER REFERENCES parks(id) ON DELETE SET NULL,
        created_at   TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── User badges table ─────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
        badge_name  VARCHAR(100) NOT NULL,
        badge_icon  VARCHAR(100),
        earned_at   TIMESTAMP DEFAULT NOW()
      );
    `);

    // ── Accommodations table ──────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS accommodations (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(150) NOT NULL,
        location    VARCHAR(150) NOT NULL,
        price       VARCHAR(100),
        distance    VARCHAR(100),
        rating      DECIMAL(2,1) DEFAULT 0.0,
        image_url   TEXT,
        park_id     INTEGER REFERENCES parks(id) ON DELETE SET NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Tables created');

    // ── Seed parks ────────────────────────────────────────────────
    await client.query(`
      INSERT INTO parks (name, location, image_url, description, animal_count, is_featured)
      VALUES
        ('Yala National Park', 'Southern Province',
         'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg/1280px-Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg',
         'Sri Lanka most visited national park, famous for leopards and elephants.', 215, TRUE),
        ('Wilpattu National Park', 'North Western Province',
         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Leopard_sitting_2.jpg/1280px-Leopard_sitting_2.jpg',
         'Largest national park in Sri Lanka, famous for leopards.', 180, FALSE),
        ('Minneriya National Park', 'North Central Province',
         'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg/1280px-Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg',
         'Known for The Gathering, the worlds largest elephant congregation.', 160, FALSE),
        ('Udawalawe National Park', 'Sabaragamuwa Province',
         'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg/1280px-Sri_Lankan_elephant_%28Elephas_maximus_maximus%29.jpg',
         'A sanctuary for Sri Lankan elephants near a reservoir.', 140, FALSE)
      ON CONFLICT DO NOTHING;
    `);

    // ── Seed accommodations ───────────────────────────────────────
    await client.query(`
      INSERT INTO accommodations (name, location, price, distance, rating)
      VALUES
        ('Yala Safari Camp',      'Yala, Southern Province',       'From LKR 15000/night', '12 km from Park Gate', 4.8),
        ('Wilpattu Rest House',   'Wilpattu, North Western',       'From LKR 8500/night',  '5 km from Park Gate',  4.5),
        ('Minneriya Eco Lodge',   'Minneriya, North Central',      'From LKR 12000/night', '3 km from Park Gate',  4.7),
        ('Udawalawe River Camp',  'Udawalawe, Sabaragamuwa',       'From LKR 10500/night', '8 km from Park Gate',  4.6)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Seed data inserted');
    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Init error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
};

initDb();
