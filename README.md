# Doormly — Real-Time Campus Marketplace

A full-stack web app for students to buy and sell items on campus. Built with real-time WebSockets, verified student accounts, and a reputation system.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Vite, Tailwind CSS         |
| Backend    | Node.js, Express, Socket.io       |
| Database   | PostgreSQL                        |
| Auth       | JWT + bcrypt (.edu email gate)    |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- **Real-time listings** — new items appear instantly via WebSockets
- **1-on-1 chat** — buyers and sellers message directly per listing
- **Student verification** — only .edu email addresses can register
- **Reputation system** — buyers rate sellers after transactions
- **Image uploads** — listings support photo uploads
- **Moderation** — users can report listings, users, and messages
- **Location tagging** — listings can be tagged with lat/lng

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup

```bash
# Clone the repo
git clone https://github.com/say3u/campus-marketplace.git
cd campus-marketplace

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE campus_marketplace;"

# Run schema
psql -U postgres -d campus_marketplace -f server/src/db/schema.sql
```

### Environment Variables

Create `server/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/campus_marketplace
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

### Run

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register with .edu email |
| POST | `/api/auth/login` | Login |
| GET | `/api/listings` | Get all listings (filterable) |
| POST | `/api/listings` | Create listing |
| GET | `/api/listings/:id` | Get listing detail |
| POST | `/api/conversations` | Start a conversation |
| GET | `/api/conversations` | Get user's conversations |
| GET | `/api/conversations/:id/messages` | Get messages |
| GET | `/api/users/:id` | Get user profile |
| POST | `/api/users/:id/rate` | Rate a user |

## WebSocket Events

| Event | Description |
|-------|-------------|
| `feed:join` | Join school's real-time listing feed |
| `listing:created` | Broadcast new listing to feed |
| `join:conversation` | Join a chat room |
| `message:send` | Send a message |
| `message:new` | Receive a new message |
