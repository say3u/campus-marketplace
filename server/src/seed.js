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
  { seller: 'alex_m',   title: 'MacBook Pro 13" 2020',         category: 'Electronics', price: 780, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop', description: 'M1 chip, 8GB RAM, 256GB SSD. Battery health 91%. Charger included.' },
  { seller: 'priya_k',  title: 'TI-84 Plus Calculator',        category: 'Electronics', price: 55,  image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', description: 'Works perfectly. Comes with batteries. Great for calculus and stats.' },
  { seller: 'jordan_t', title: 'Sony WH-1000XM4 Headphones',   category: 'Electronics', price: 180, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', description: 'Noise cancelling, excellent condition. Barely used this semester.' },
  { seller: 'alex_m',   title: 'iPad 9th Gen + Apple Pencil',  category: 'Electronics', price: 320, image: 'https://images.unsplash.com/photo-1544244015-0df4592c9a44?w=400&h=300&fit=crop', description: 'Perfect for note-taking. 64GB WiFi. Case and pencil included.' },
  { seller: 'priya_k',  title: 'Mechanical Keyboard',          category: 'Electronics', price: 65,  image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', description: 'Keychron K2 with brown switches. Compact 75% layout. Like new.' },

  // Textbooks
  { seller: 'jordan_t', title: 'Calculus: Early Transcendentals 8e', category: 'Textbooks', price: 40, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop', description: 'Stewart 8th edition. Minor highlighting in chapters 1-3. No missing pages.' },
  { seller: 'alex_m',   title: 'Organic Chemistry Clayden',    category: 'Textbooks', price: 50, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop', description: 'Clean copy, no marks. Saved me in orgo.' },
  { seller: 'priya_k',  title: 'Introduction to Psychology',   category: 'Textbooks', price: 25, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop', description: 'Myers & DeWall, 13th edition. Great condition.' },
  { seller: 'jordan_t', title: 'Economics: Principles & Apps', category: 'Textbooks', price: 30, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop', description: 'Mankiw, used for Econ 101. Light notes in pencil.' },

  // Furniture
  { seller: 'priya_k',  title: 'IKEA ALEX Desk',               category: 'Furniture', price: 95, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', description: 'White, 6 drawers. Disassembled for easy transport. Pick up only.' },
  { seller: 'alex_m',   title: 'Mini Fridge 3.2 cu ft',        category: 'Furniture', price: 75, image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=300&fit=crop', description: 'Galanz, works perfectly. Perfect for a dorm room. Clean inside.' },
  { seller: 'jordan_t', title: 'Desk Lamp (LED, adjustable)',  category: 'Furniture', price: 18, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop', description: 'USB-C powered, 3 brightness levels. Great for late night studying.' },

  // Clothing
  { seller: 'jordan_t', title: 'North Face Puffer Jacket (M)', category: 'Clothing', price: 85, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=300&fit=crop', description: "Navy blue, men's medium. Warm and barely worn. No damage." },
  { seller: 'priya_k',  title: 'Lululemon Align Leggings (4)', category: 'Clothing', price: 45, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=300&fit=crop', description: 'Black, size 4. Worn twice. Like new condition.' },

  // Services
  { seller: 'alex_m',   title: 'Math Tutoring (Calc 1 & 2)',   category: 'Services', price: 20, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop', description: 'A+ in both Calc 1 and 2. Happy to help weekly or per session.' },
  { seller: 'priya_k',  title: 'Resume & Cover Letter Review', category: 'Services', price: 15, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop', description: 'CS/pre-med experience. Will review and give feedback within 24 hours.' },

  // Other
  { seller: 'jordan_t', title: 'Trek Road Bike',               category: 'Other', price: 220, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', description: 'Trek FX 2, size M. Recently tuned up. Great for getting around campus.' },
  { seller: 'alex_m',   title: 'Keurig K-Mini Coffee Maker',   category: 'Other', price: 28,  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', description: "Black, works great. Selling because I'm graduating. No pods included." },
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
      `INSERT INTO listings (seller_id, title, description, price, category, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
      [sellerId, l.title, l.description, l.price, l.category, l.image]
    );
    console.log(`  listing: ${l.title} ($${l.price})`);
  }

  console.log(`\nDone. ${LISTINGS.length} listings inserted.`);
  console.log(`\nSample login:\n  email:    alex@stateuniversity.edu\n  password: ${PASSWORD}`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
