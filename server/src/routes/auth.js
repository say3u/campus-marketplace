const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SALT_ROUNDS = 12;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ error: 'All fields required' });

  const emailLower = email.toLowerCase();
  if (!emailLower.endsWith('.edu')) return res.status(400).json({ error: 'Must use a .edu email' });

  const school = emailLower.split('@')[1];

  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await db.query(
      `INSERT INTO users (email, username, password, school)
       VALUES ($1, $2, $3, $4) RETURNING id, email, username, school, rep_score`,
      [emailLower, username, hash, school]
    );
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email or username already taken' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });

  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...user } = rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  const { rows } = await db.query(
    'SELECT id, email, username, school, avatar_url, rep_score, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

module.exports = router;
