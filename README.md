# TheftCheck

A web app for checking whether a phone has been reported stolen. Users search by IMEI number and see any active theft reports against the device.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript            |
| Database | PostgreSQL via Prisma ORM               |
| Auth     | Google OAuth 2.0 → JWT                 |

## Project Structure

```
theftcheck/
├── frontend/       # React + Vite app (port 5174)
└── backend/        # Express API (port 3000)
```

## Prerequisites

- Node.js 18+
- PostgreSQL (local or Docker)
- A Google Cloud project with OAuth 2.0 credentials

## Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd theftcheck
npm run install:all
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/theftcheck"
JWT_SECRET="a_random_string_at_least_32_characters"
JWT_ISSUER="theftcheck_api"
JWT_AUDIENCE="theftcheck_client"
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
ADMIN_EMAILS="you@example.com"
PORT=3000
```

### 3. Configure the frontend

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
```

### 4. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Start development servers

In two separate terminals:

```bash
# Terminal 1 — backend
npm run dev:backend

# Terminal 2 — frontend
npm run dev:frontend
```

The frontend runs at `http://localhost:5174` and proxies all `/api` requests to the backend at `http://localhost:3000`.

## API Reference

| Method | Endpoint            | Auth     | Description                        |
|--------|---------------------|----------|------------------------------------|
| POST   | `/api/auth/google`  | None     | Exchange Google ID token for JWT   |
| POST   | `/api/auth/logout`  | Required | Revoke the current JWT             |
| GET    | `/api/search?imei=` | None     | Look up a device by IMEI number    |

### POST `/api/auth/google`

**Request:**
```json
{ "idToken": "<google_id_token>" }
```

**Response:**
```json
{
  "token": "<jwt>",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

### GET `/api/search?imei=356938035643809`

**Response (found):**
```json
{
  "imei": "356938035643809",
  "brand": "Apple",
  "model": "iPhone 14",
  "isStolen": true,
  "complaints": [
    {
      "id": 1,
      "locationStolen": "Dhaka, Bangladesh",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

**Response (not found):** `404 { "error": "No device found with that IMEI" }`

## Database Schema

```
User          — Google-authenticated users (googleId, email, name, isAdmin)
Device        — Registered phones (imei, brand, model)
Complaint     — Theft reports linking a user to a device (locationStolen, status)
RevokedToken  — Invalidated JWTs for secure logout
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:5174` to **Authorized JavaScript origins**
4. Copy the Client ID into both `.env` files

## Production Build

```bash
npm run build:frontend   # outputs to frontend/dist/
npm run build:backend    # outputs to backend/dist/
```
