# WildX Backend API

A production-ready Node.js backend for the WildX wildlife safari accommodation booking app.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/wildx
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Setup Database

Generate Prisma client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Seed the database with sample data:

```bash
npm run db:seed
```

### 4. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL

All endpoints are prefixed with `/api/v1`

### Health Check

```
GET /health
```

### Accommodations

#### List Accommodations

```
GET /api/v1/accommodations
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `maxPrice` | number | Filter by max price per night |
| `maxDistance` | number | Filter by max distance from gate (km) |
| `ecoFriendly` | boolean | Filter eco-friendly only |
| `familyFriendly` | boolean | Filter family-friendly only |
| `hasJeepHire` | boolean | Filter accommodations with jeep hire |
| `parkName` | string | Filter by park name (partial match) |
| `sortBy` | string | Sort by: `rating`, `distance`, `price`, `familyFriendly` |
| `sortOrder` | string | `asc` or `desc` |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |

Example:
```bash
curl "http://localhost:3000/api/v1/accommodations?maxPrice=10000&ecoFriendly=true&sortBy=rating"
```

Response:
```json
{
  "success": true,
  "data": {
    "accommodations": [
      {
        "id": "acc_001",
        "name": "Green Valley Eco-Lodge",
        "parkName": "Yala National Park",
        "pricePerNight": 9500,
        "distanceFromGate": 4.0,
        "travelTime": "20 mins",
        "fuelStops": 1,
        "rating": 4.9,
        "isEcoFriendly": true,
        "isFamilyFriendly": true,
        "hasJeepHire": true,
        "imageUrls": ["https://..."],
        "description": "..."
      }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 4,
    "itemsPerPage": 20
  }
}
```

#### Get Single Accommodation

```
GET /api/v1/accommodations/:id
```

Example:
```bash
curl "http://localhost:3000/api/v1/accommodations/acc_001"
```

#### Check Availability

```
GET /api/v1/accommodations/:id/availability
```

Query Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checkIn` | string | Yes | Check-in date (YYYY-MM-DD) |
| `checkOut` | string | Yes | Check-out date (YYYY-MM-DD) |
| `guests` | number | No | Number of guests |

Example:
```bash
curl "http://localhost:3000/api/v1/accommodations/acc_001/availability?checkIn=2026-04-01&checkOut=2026-04-03"
```

Response:
```json
{
  "success": true,
  "data": {
    "available": true,
    "pricePerNight": 9500,
    "totalNights": 2,
    "estimatedTotal": 19000
  }
}
```

### Authentication

#### Register

```
POST /api/v1/auth/register
```

Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+94771234567"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "a1b2c3d4e5f6...",
    "expiresIn": "1h",
    "user": {
      "userId": "clx...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "message": "Registration successful"
}
```

#### Login

```
POST /api/v1/auth/login
```

Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token

```
POST /api/v1/auth/refresh
```

Body:
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### Logout

```
POST /api/v1/auth/logout
```

Body:
```json
{
  "refreshToken": "your-refresh-token"
}
```

### Bookings (Requires Authentication)

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

#### Create Booking

```
POST /api/v1/bookings
```

Body:
```json
{
  "accommodationId": "acc_001",
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-03",
  "adults": 2,
  "children": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "bookingId": "BK-1710923456789-a2b3",
    "accommodationId": "acc_001",
    "accommodationName": "Green Valley Eco-Lodge",
    "parkName": "Yala National Park",
    "imageUrl": "https://...",
    "checkInDate": "2026-04-01T00:00:00.000Z",
    "checkOutDate": "2026-04-03T00:00:00.000Z",
    "nights": 2,
    "adults": 2,
    "children": 1,
    "totalGuests": 3,
    "accommodationCost": 47500,
    "serviceFee": 2375,
    "totalPrice": 49875,
    "status": "confirmed",
    "createdAt": "2026-03-20T10:30:00.000Z"
  },
  "message": "Booking created successfully"
}
```

**Pricing Calculation:**
- Adults: `pricePerNight × adults × nights`
- Children: `pricePerNight × 0.5 × children × nights` (50% rate)
- Service Fee: `5%` of accommodation cost
- Total: `accommodationCost + serviceFee`

#### List User's Bookings

```
GET /api/v1/bookings
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status |
| `upcoming` | boolean | Filter future bookings only |
| `page` | number | Page number |
| `limit` | number | Items per page |

Example:
```bash
curl -H "Authorization: Bearer <token>" "http://localhost:3000/api/v1/bookings?upcoming=true"
```

#### Get Single Booking

```
GET /api/v1/bookings/:bookingId
```

#### Cancel Booking

```
DELETE /api/v1/bookings/:bookingId
```

### User Profile (Requires Authentication)

#### Get Profile

```
GET /api/v1/users/me
```

#### Update Profile

```
PUT /api/v1/users/me
```

Body:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+94777654321"
}
```

#### Change Password

```
PUT /api/v1/users/me/password
```

Body:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INVALID_DATE_RANGE` | 400 | Invalid check-in/check-out dates |
| `UNAUTHORIZED` | 401 | Authentication required |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `INVALID_TOKEN` | 401 | Invalid JWT token |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `ACCOMMODATION_NOT_FOUND` | 404 | Accommodation not found |
| `BOOKING_NOT_FOUND` | 404 | Booking not found |
| `CONFLICT` | 409 | Resource conflict |
| `DATES_UNAVAILABLE` | 409 | Booking dates not available |
| `EMAIL_EXISTS` | 409 | Email already registered |
| `INTERNAL_ERROR` | 500 | Server error |

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Push schema changes (dev only)
npm run db:push

# Seed the database
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── accommodation.controller.js
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   └── user.controller.js
│   ├── routes/               # Route definitions
│   │   ├── accommodation.routes.js
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   └── user.routes.js
│   ├── services/             # Business logic
│   │   ├── accommodation.service.js
│   │   ├── auth.service.js
│   │   ├── booking.service.js
│   │   └── user.service.js
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── validators/           # Zod schemas
│   │   ├── accommodation.validator.js
│   │   ├── auth.validator.js
│   │   └── booking.validator.js
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seed data
│   ├── utils/
│   │   ├── errors.js         # Error classes
│   │   ├── prisma.js         # Prisma client
│   │   └── response.js       # Response helpers
│   └── app.js                # Express app entry
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Sample Data

The seed script creates:

**3 National Parks:**
- Yala National Park
- Wilpattu National Park
- Udawalawe National Park

**4 Accommodations:**
- Green Valley Eco-Lodge (Yala) - LKR 9,500/night
- Yala Safari Lodge (Yala) - LKR 8,500/night
- Wilpattu Forest Camp (Wilpattu) - LKR 6,200/night
- Udawalawe Family Resort (Udawalawe) - LKR 12,000/night

## License

MIT
