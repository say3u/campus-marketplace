const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

async function adminOnly(req, res, next) {
  const { rows } = await db.query('SELECT is_admin FROM users WHERE id=$1', [req.user.id]);
  if (!rows[0]?.is_admin) return res.status(403).json({ error: 'Forbidden' });
  next();
}

// GET /api/admin/reports
router.get('/reports', auth, adminOnly, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, u.username as reporter_username
       FROM reports r
       JOIN users u ON u.id = r.reporter_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/reports/:id — dismiss a report
router.delete('/reports/:id', auth, adminOnly, async (req, res) => {
  await db.query('DELETE FROM reports WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

// DELETE /api/admin/listings/:id — remove a listing (moderation)
router.delete('/listings/:id', auth, adminOnly, async (req, res) => {
  await db.query("UPDATE listings SET status='removed' WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
