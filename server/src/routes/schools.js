const router = require('express').Router();
const { getSchoolTheme } = require('../services/schoolTheme');

// GET /api/schools/:domain/theme
router.get('/:domain/theme', async (req, res) => {
  try {
    const theme = await getSchoolTheme(req.params.domain);
    res.json(theme);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
