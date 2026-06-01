const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use on routes that require email verification (posting listings, messaging)
module.exports.requireVerified = async function (req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const { rows } = await db.query('SELECT email_verified FROM users WHERE id=$1', [req.user.id]);
    if (!rows[0]?.email_verified) {
      return res.status(403).json({ error: 'Please verify your email before doing this.' });
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
