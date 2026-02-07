const express = require('express');
const router = express.Router();
const { addRecurringPayment } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/recurring/add
router.post('/add', protect, addRecurringPayment);

module.exports = router;