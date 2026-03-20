# WildX Backend API 🌿

Node.js + Express + Neon PostgreSQL backend for the WildX Flutter app.

## Project Structure

```
wildx-backend/
├── app.js                        ← Express app setup
├── .env                          ← Your Neon DATABASE_URL (not committed)
├── .env.example                  ← Template
├── .gitignore
├── package.json
└── src/
    ├── index.js                  ← Server entry point
    ├── db/
    │   ├── db.js                 ← Neon PostgreSQL connection (pg Pool)
    │   ├── migrate.js            ← Creates all tables
    │   └── seed.js               ← Inserts sample WildX data
    ├── models/
    │   ├── rangerModel.js        ← rangers table queries
    │   ├── badgeModel.js         ← badges table queries
    │   └── parkModel.js          ← park_visits table queries
    ├── controllers/
    │   ├── rangerController.js   ← ranger request handlers
    │   ├── badgeController.js    ← badge request handlers
    │   └── parkController.js     ← park request handlers
    └── routes/
        ├── rangerRoutes.js       ← /api/rangers
        ├── badgeRoutes.js        ← /api/badges
        └── parkRoutes.js         ← /api/parks
```

## Neon Database Tables

| Table | Description |
|---|---|
| `rangers` | User profiles — name, email, xp, level, stats |
| `badges` | Earned/unearned badges per ranger |
| `park_visits` | Parks visited + visit counts per ranger |

## Setup

### 1. Create a Neon project
- Go to [https://console.neon.tech](https://console.neon.tech)
- Create a project → copy the **Connection string**

### 2. Configure environment
```bash
cp .env.example .env
# Paste your Neon connection string into .env
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run migrations (creates tables)
```bash
npm run db:migrate
```

### 5. Seed sample data
```bash
npm run db:seed
```

### 6. Start server
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

## API Endpoints

### Rangers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/rangers` | Get all rangers |
| GET | `/api/rangers/:id` | Get ranger + badges + parks |
| POST | `/api/rangers` | Create ranger |
| PUT | `/api/rangers/:id` | Update profile |
| PATCH | `/api/rangers/:id/xp` | Update XP & level |
| PATCH | `/api/rangers/:id/stat` | Increment sightings/parks/photos |
| DELETE | `/api/rangers/:id` | Delete ranger |

### Badges
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/badges/ranger/:ranger_id` | Get all badges for ranger |
| POST | `/api/badges` | Create badge |
| PATCH | `/api/badges/:id/earn` | Mark badge as earned |
| DELETE | `/api/badges/:id` | Delete badge |

### Parks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/parks/ranger/:ranger_id` | Get park visits for ranger |
| POST | `/api/parks` | Add park visit |
| PATCH | `/api/parks/:id/visit` | Increment visit count |
| PUT | `/api/parks/:id` | Update park record |
| DELETE | `/api/parks/:id` | Delete park record |

## Flutter Connection

In your Flutter app set your base URL:
```dart
// lib/data/api_client.dart
const String kBaseUrl = 'http://localhost:3000/api';

// Fetch full ranger profile:
// GET kBaseUrl/rangers/1
// → returns ranger + badges + top_parks in one call
```
