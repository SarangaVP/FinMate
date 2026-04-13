const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/reportController');

router.get('/analytics', protect, getAnalytics);

module.exports = router;
