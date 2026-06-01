const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const auth = require('../middleware/auth');
const { requireVerified } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/listings — paginated, filterable
router.get('/', async (req, res) => {
  const { category, school, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = ["l.status = 'active'"];

  if (category) { params.push(category);      conditions.push(`l.category = $${params.length}`); }
  if (school)   { params.push(school);        conditions.push(`u.school = $${params.length}`); }
  if (search)   { params.push(`%${search}%`); conditions.push(`l.title ILIKE $${params.length}`); }
  if (minPrice) { params.push(minPrice);      conditions.push(`l.price >= $${params.length}`); }
  if (maxPrice) { params.push(maxPrice);      conditions.push(`l.price <= $${params.length}`); }

  params.push(limit, offset);
  const where = conditions.join(' AND ');

  try {
    const { rows } = await db.query(
      `SELECT l.*, u.username, u.rep_score, u.school
       FROM listings l JOIN users u ON u.id = l.seller_id
       WHERE ${where}
       ORDER BY (l.boosted = TRUE AND l.boosted_until > NOW()) DESC, l.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/listings/favorites — must be before /:id
router.get('/favorites', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT l.*, u.username, u.rep_score, u.school, TRUE as is_favorited
       FROM listings l
       JOIN favorites f ON f.listing_id = l.id
       JOIN users u ON u.id = l.seller_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/listings/:id/favorite — toggle
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const existing = await db.query(
      'SELECT 1 FROM favorites WHERE user_id=$1 AND listing_id=$2',
      [req.user.id, req.params.id]
    );
    if (existing.rows.length) {
      await db.query('DELETE FROM favorites WHERE user_id=$1 AND listing_id=$2', [req.user.id, req.params.id]);
      res.json({ favorited: false });
    } else {
      await db.query('INSERT INTO favorites (user_id, listing_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, req.params.id]);
      res.json({ favorited: true });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT l.*, u.username, u.rep_score, u.school, u.avatar_url
       FROM listings l JOIN users u ON u.id = l.seller_id
       WHERE l.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/listings
router.post('/', requireVerified, upload.single('image'), async (req, res) => {
  const { title, description, price, category, lat, lng } = req.body;
  if (!title || !price || !category) return res.status(400).json({ error: 'title, price, category required' });

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const { rows } = await db.query(
      `INSERT INTO listings (seller_id, title, description, price, category, image_url, lat, lng)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, title, description, price, category, image_url, lat || null, lng || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/listings/:id — edit listing
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { title, description, price, category, status } = req.body;
  try {
    const existing = await db.query('SELECT * FROM listings WHERE id=$1 AND seller_id=$2', [req.params.id, req.user.id]);
    if (!existing.rows.length) return res.status(403).json({ error: 'Not found or not authorized' });

    const image_url = req.file ? `/uploads/${req.file.filename}` : existing.rows[0].image_url;

    const { rows } = await db.query(
      `UPDATE listings SET title=$1, description=$2, price=$3, category=$4, status=$5, image_url=$6
       WHERE id=$7 AND seller_id=$8 RETURNING *`,
      [title, description, price, category, status, image_url, req.params.id, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/listings/:id/status
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  if (!['active', 'sold', 'removed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const { rows } = await db.query(
      `UPDATE listings SET status=$1 WHERE id=$2 AND seller_id=$3 RETURNING *`,
      [status, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ error: 'Not found or not authorized' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/listings/:id/boost
router.post('/:id/boost', auth, async (req, res) => {
  const boosted_until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  try {
    const { rows } = await db.query(
      `UPDATE listings SET boosted=TRUE, boosted_until=$1
       WHERE id=$2 AND seller_id=$3 RETURNING *`,
      [boosted_until, req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ error: 'Not found or not authorized' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM listings WHERE id=$1 AND seller_id=$2',
      [req.params.id, req.user.id]
    );
    if (!rowCount) return res.status(403).json({ error: 'Not found or not authorized' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
