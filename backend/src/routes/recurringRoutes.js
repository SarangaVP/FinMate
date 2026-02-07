const express = require('express');
const router = express.Router();
const { addRecurringPayment, getRecurringPayments } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/recurring/
router.get('/', protect, getRecurringPayments);

// POST /api/recurring/add
router.post('/add', protect, addRecurringPayment);

module.exports = router;