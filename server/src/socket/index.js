const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = function initSocket(io) {
  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.id}`);

    // Join a conversation room
    socket.on('join:conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Send a message
    socket.on('message:send', async ({ conversationId, body }) => {
      if (!body?.trim()) return;

      try {
        // Verify user is part of conversation
        const convo = await db.query(
          'SELECT * FROM conversations WHERE id=$1 AND (buyer_id=$2 OR seller_id=$2)',
          [conversationId, socket.user.id]
        );
        if (!convo.rows.length) return;

        const { rows } = await db.query(
          `INSERT INTO messages (conversation_id, sender_id, body)
           VALUES ($1,$2,$3) RETURNING *`,
          [conversationId, socket.user.id, body.trim()]
        );

        const [message] = await db.query(
          `SELECT m.*, u.username, u.avatar_url
           FROM messages m JOIN users u ON u.id = m.sender_id
           WHERE m.id=$1`,
          [rows[0].id]
        ).then(r => [r.rows[0]]);

        io.to(`conversation:${conversationId}`).emit('message:new', message);
      } catch (err) {
        console.error('message:send error', err);
      }
    });

    // Broadcast new listing to school feed
    socket.on('listing:created', async (listingId) => {
      try {
        const { rows } = await db.query(
          `SELECT l.*, u.username, u.rep_score, u.school
           FROM listings l JOIN users u ON u.id = l.seller_id
           WHERE l.id=$1 AND l.seller_id=$2`,
          [listingId, socket.user.id]
        );
        if (!rows.length) return;
        io.emit(`feed:${rows[0].school}`, { type: 'listing:new', listing: rows[0] });
      } catch (err) {
        console.error('listing:created error', err);
      }
    });

    // Join school feed room for real-time listings
    socket.on('feed:join', (school) => {
      socket.join(`feed:${school}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.id}`);
    });
  });
};
