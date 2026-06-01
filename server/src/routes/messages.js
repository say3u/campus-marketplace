const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/conversations — start or get existing convo for a listing
router.post('/conversations', auth, async (req, res) => {
  const { listing_id } = req.body;
  if (!listing_id) return res.status(400).json({ error: 'listing_id required' });

  try {
    const listing = await db.query('SELECT seller_id FROM listings WHERE id=$1', [listing_id]);
    if (!listing.rows.length) return res.status(404).json({ error: 'Listing not found' });

    const seller_id = listing.rows[0].seller_id;
    if (seller_id === req.user.id) return res.status(400).json({ error: 'Cannot message yourself' });

    const existing = await db.query(
      'SELECT * FROM conversations WHERE listing_id=$1 AND buyer_id=$2',
      [listing_id, req.user.id]
    );
    if (existing.rows.length) return res.json(existing.rows[0]);

    const { rows } = await db.query(
      `INSERT INTO conversations (listing_id, buyer_id, seller_id)
       VALUES ($1,$2,$3) RETURNING *`,
      [listing_id, req.user.id, seller_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/conversations — all convos for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.*, l.title as listing_title, l.image_url, l.price, l.status as listing_status,
              b.username as buyer_username, s.username as seller_username,
              (SELECT body FROM messages WHERE conversation_id=c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
              (SELECT COUNT(*) FROM messages WHERE conversation_id=c.id AND sender_id != $1 AND read = FALSE)::int as unread_count
       FROM conversations c
       JOIN listings l ON l.id = c.listing_id
       JOIN users b ON b.id = c.buyer_id
       JOIN users s ON s.id = c.seller_id
       WHERE c.buyer_id=$1 OR c.seller_id=$1
       ORDER BY (SELECT sent_at FROM messages WHERE conversation_id=c.id ORDER BY sent_at DESC LIMIT 1) DESC NULLS LAST`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/conversations/:id/read — mark all messages as read
router.patch('/conversations/:id/read', auth, async (req, res) => {
  try {
    await db.query(
      `UPDATE messages SET read=TRUE WHERE conversation_id=$1 AND sender_id != $2`,
      [req.params.id, req.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/conversations/:id/messages
router.get('/conversations/:id/messages', auth, async (req, res) => {
  try {
    const convo = await db.query(
      'SELECT * FROM conversations WHERE id=$1 AND (buyer_id=$2 OR seller_id=$2)',
      [req.params.id, req.user.id]
    );
    if (!convo.rows.length) return res.status(403).json({ error: 'Not authorized' });

    const { rows } = await db.query(
      `SELECT m.*, u.username, u.avatar_url
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.conversation_id=$1 ORDER BY m.sent_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reports
router.post('/reports', auth, async (req, res) => {
  const { target_type, target_id, reason } = req.body;
  if (!target_type || !target_id || !reason) return res.status(400).json({ error: 'All fields required' });

  try {
    await db.query(
      'INSERT INTO reports (reporter_id, target_type, target_id, reason) VALUES ($1,$2,$3,$4)',
      [req.user.id, target_type, target_id, reason]
    );
    res.status(201).json({ message: 'Report submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
