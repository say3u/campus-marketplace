CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  school      TEXT NOT NULL,
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  avatar_url  TEXT,
  rep_score   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  category    TEXT NOT NULL,
  image_url   TEXT,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, buyer_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT NOT NULL,
  sent_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rater_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  ratee_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  score       INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rater_id, listing_id)
);

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing','user','message')),
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX ON listings(seller_id);
CREATE INDEX ON listings(status);
CREATE INDEX ON listings(category);
CREATE INDEX ON messages(conversation_id);
CREATE INDEX ON conversations(buyer_id);
CREATE INDEX ON conversations(seller_id);
