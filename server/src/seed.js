/**
 * Seed script — inserts sample users and listings.
 * Run from the server directory:  node src/seed.js
 *
 * Safe to re-run: uses ON CONFLICT DO NOTHING for users.
 * Listings are inserted fresh each run (to let you reset easily).
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

const SCHOOL = 'State University';
const PASSWORD = 'password123';

// Use a real .edu domain so the school field parses correctly
const USERS = [
  { email: 'alex@mit.edu',   username: 'alex_m',   avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=alex_m&backgroundColor=b6e3f4' },
  { email: 'priya@mit.edu',  username: 'priya_k',  avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=priya_k&backgroundColor=ffd5dc' },
  { email: 'jordan@mit.edu', username: 'jordan_t', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=jordan_t&backgroundColor=c0aede' },
];

const LISTINGS = [
  // Electronics
  { seller: 'alex_m',    title: 'MacBook Pro 13" 2020',         category: 'Electronics', price: 780,  description: 'M1 chip, 8GB RAM, 256GB SSD. Battery health 91%. Charger included.' },
  { seller: 'priya_k',   title: 'TI-84 Plus Calculator',        category: 'Electronics', price: 55,   description: 'Works perfectly. Comes with batteries. Great for calculus and stats.' },
  { seller: 'jordan_t',  title: 'Sony WH-1000XM4 Headphones',   category: 'Electronics', price: 180,  description: 'Noise cancelling, excellent condition. Barely used this semester.' },
  { seller: 'alex_m',    title: 'iPad 9th Gen + Apple Pencil',  category: 'Electronics', price: 320,  description: 'Perfect for note-taking. 64GB WiFi. Case and pencil included.' },
  { seller: 'priya_k',   title: 'Mechanical Keyboard',          category: 'Electronics', price: 65,   description: 'Keychron K2 with brown switches. Compact 75% layout. Like new.' },

  // Textbooks
  { seller: 'jordan_t',  title: 'Calculus: Early Transcendentals 8e', category: 'Textbooks', price: 40, description: 'Stewart 8th edition. Minor highlighting in chapters 1-3. No missing pages.' },
  { seller: 'alex_m',    title: 'Organic Chemistry Clayden',    category: 'Textbooks', price: 50,   description: 'Clean copy, no marks. Saved me in orgo.' },
  { seller: 'priya_k',   title: 'Introduction to Psychology',   category: 'Textbooks', price: 25,   description: 'Myers & DeWall, 13th edition. Great condition.' },
  { seller: 'jordan_t',  title: 'Economics: Principles & Apps', category: 'Textbooks', price: 30,   description: 'Mankiw, used for Econ 101. Light notes in pencil.' },

  // Furniture
  { seller: 'priya_k',   title: 'IKEA ALEX Desk',               category: 'Furniture', price: 95,   description: 'White, 6 drawers. Disassembled for easy transport. Pick up only.' },
  { seller: 'alex_m',    title: 'Mini Fridge 3.2 cu ft',        category: 'Furniture', price: 75,   description: 'Galanz, works perfectly. Perfect for a dorm room. Clean inside.' },
  { seller: 'jordan_t',  title: 'Desk Lamp (LED, adjustable)',  category: 'Furniture', price: 18,   description: 'USB-C powered, 3 brightness levels. Great for late night studying.' },

  // Clothing
  { seller: 'jordan_t',  title: 'North Face Puffer Jacket (M)', category: 'Clothing', price: 85,   description: 'Navy blue, men\'s medium. Warm and barely worn. No damage.' },
  { seller: 'priya_k',   title: 'Lululemon Align Leggings (4)', category: 'Clothing', price: 45,   description: 'Black, size 4. Worn twice. Like new condition.' },

  // Services
  { seller: 'alex_m',    title: 'Math Tutoring (Calc 1 & 2)',   category: 'Services', price: 20,   description: 'A+ in both Calc 1 and 2. Happy to help weekly or per session. Online or campus library.' },
  { seller: 'priya_k',   title: 'Resume & Cover Letter Review', category: 'Services', price: 15,   description: 'CS/pre-med experience. Will review and give feedback within 24 hours.' },

  // Other
  { seller: 'jordan_t',  title: 'Trek Road Bike',               category: 'Other',    price: 220,  description: 'Trek FX 2, size M. Recently tuned up. Great for getting around campus.' },
  { seller: 'alex_m',    title: 'Keurig K-Mini Coffee Maker',   category: 'Other',    price: 28,   description: 'Black, works great. Selling because I\'m graduating. No pods included.' },
];

async function seed() {
  console.log('Seeding database...\n');
  const hash = await bcrypt.hash(PASSWORD, 10);

  // Create users
  const userMap = {};
  for (const u of USERS) {
    const school = u.email.split('@')[1];
    const { rows } = await db.query(
      `INSERT INTO users (email, username, password, school, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET username=EXCLUDED.username, avatar_url=EXCLUDED.avatar_url
       RETURNING id, username`,
      [u.email, u.username, hash, school, u.avatar]
    );
    userMap[u.username] = rows[0].id;
    console.log(`  user: ${u.username} (id ${rows[0].id})`);
  }

  // Clear existing seed listings (by these users) to avoid duplication
  const sellerIds = Object.values(userMap);
  await db.query(
    `DELETE FROM listings WHERE seller_id = ANY($1)`,
    [sellerIds]
  );

  // Insert listings
  for (const l of LISTINGS) {
    const sellerId = userMap[l.seller];
    await db.query(
      `INSERT INTO listings (seller_id, title, description, price, category, status)
       VALUES ($1, $2, $3, $4, $5, 'active')`,
      [sellerId, l.title, l.description, l.price, l.category]
    );
    console.log(`  listing: ${l.title} ($${l.price})`);
  }

  console.log(`\nDone. ${LISTINGS.length} listings inserted.`);
  console.log(`\nSample login:\n  email:    alex@stateuniversity.edu\n  password: ${PASSWORD}`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
