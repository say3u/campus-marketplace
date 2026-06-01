require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Rate limiting — tight on auth, relaxed on general API
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 120,
  message: { error: 'Too many requests.' },
});
app.use('/api/auth', authLimiter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', apiLimiter, require('./routes/listings'));
app.use('/api/users', apiLimiter, require('./routes/users'));
app.use('/api', apiLimiter, require('./routes/messages'));

require('./socket')(io);

// Migrations
const db = require('./db');
db.query(`
  ALTER TABLE listings ADD COLUMN IF NOT EXISTS boosted BOOLEAN DEFAULT FALSE;
  ALTER TABLE listings ADD COLUMN IF NOT EXISTS boosted_until TIMESTAMP;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
  ALTER TABLE messages ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;
  CREATE TABLE IF NOT EXISTS favorites (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
  );
  CREATE TABLE IF NOT EXISTS blocks (
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (blocker_id, blocked_id)
  );
  CREATE TABLE IF NOT EXISTS school_themes (
    domain TEXT PRIMARY KEY,
    primary_color TEXT NOT NULL DEFAULT '#14B8A6',
    secondary_color TEXT NOT NULL DEFAULT '#0D9488',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES users(id),
    target_type TEXT,
    target_id TEXT,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
`).catch(e => console.error('Migration:', e.message));

app.use('/api/admin', require('./routes/admin'));
app.use('/api/schools', require('./routes/schools'));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
