const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, `avatar_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 3 * 1024 * 1024 } });

// GET /api/users/:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, username, school, avatar_url, rep_score, created_at FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!user.rows.length) return res.status(404).json({ error: 'User not found' });

    const listings = await db.query(
      `SELECT * FROM listings WHERE seller_id=$1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    const ratings = await db.query(
      `SELECT r.*, u.username as rater_username
       FROM ratings r JOIN users u ON u.id = r.rater_id
       WHERE r.ratee_id=$1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json({ ...user.rows[0], listings: listings.rows, ratings: ratings.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/me/avatar — upload profile picture
router.patch('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const avatar_url = `/uploads/${req.file.filename}`;
  try {
    await db.query('UPDATE users SET avatar_url=$1 WHERE id=$2', [avatar_url, req.user.id]);
    res.json({ avatar_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/block — toggle block
router.post('/:id/block', auth, async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot block yourself' });
  try {
    const existing = await db.query(
      'SELECT 1 FROM blocks WHERE blocker_id=$1 AND blocked_id=$2',
      [req.user.id, req.params.id]
    );
    if (existing.rows.length) {
      await db.query('DELETE FROM blocks WHERE blocker_id=$1 AND blocked_id=$2', [req.user.id, req.params.id]);
      res.json({ blocked: false });
    } else {
      await db.query('INSERT INTO blocks (blocker_id, blocked_id) VALUES ($1,$2)', [req.user.id, req.params.id]);
      res.json({ blocked: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/:id/rate — rate a user
router.post('/:id/rate', auth, async (req, res) => {
  const { score, comment, listing_id } = req.body;
  if (!score || !listing_id) return res.status(400).json({ error: 'score and listing_id required' });
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot rate yourself' });

  try {
    await db.query(
      `INSERT INTO ratings (rater_id, ratee_id, listing_id, score, comment)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (rater_id, listing_id) DO UPDATE SET score=$4, comment=$5`,
      [req.user.id, req.params.id, listing_id, score, comment]
    );
    const avg = await db.query(
      'SELECT ROUND(AVG(score)) as avg FROM ratings WHERE ratee_id=$1',
      [req.params.id]
    );
    await db.query('UPDATE users SET rep_score=$1 WHERE id=$2', [avg.rows[0].avg || 0, req.params.id]);
    res.status(201).json({ message: 'Rating submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/me/listings
router.get('/me/listings', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM listings WHERE seller_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
