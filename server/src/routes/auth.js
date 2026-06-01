const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendVerificationEmail(email, token) {
  if (!process.env.SMTP_HOST) return; // Skip if SMTP not configured
  const url = `${process.env.CLIENT_URL}/verify/${token}`;
  await mailer.sendMail({
    from: `"Doormly" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your Doormly account',
    html: `<p>Click the link below to verify your email:</p><p><a href="${url}">${url}</a></p><p>Link expires in 24 hours.</p>`,
  });
}

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
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const { rows } = await db.query(
      `INSERT INTO users (email, username, password, school, verification_token)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, school, rep_score, email_verified`,
      [emailLower, username, hash, school, verificationToken]
    );
    sendVerificationEmail(emailLower, verificationToken).catch(() => {});
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

// GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  try {
    const { rows } = await db.query(
      `UPDATE users SET email_verified=TRUE, verification_token=NULL
       WHERE verification_token=$1 RETURNING id`,
      [req.params.token]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token' });
    res.json({ message: 'Email verified!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const { rows } = await db.query(
      `UPDATE users SET verification_token=$1 WHERE email=$2 AND email_verified=FALSE RETURNING email`,
      [token, email.toLowerCase()]
    );
    if (rows.length) sendVerificationEmail(rows[0].email, token).catch(() => {});
    res.json({ message: 'If that email exists, a verification link was sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  const { rows } = await db.query(
    'SELECT id, email, username, school, avatar_url, rep_score, email_verified, is_admin, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

module.exports = router;
