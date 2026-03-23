const express = require('express');
const router = express.Router();
const { addRecurringPayment, getRecurringPayments, updateRecurring, deleteRecurring, payRecurring } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecurringPayments);
router.post('/add', protect, addRecurringPayment);
router.put('/:id', protect, updateRecurring);
router.delete('/:id', protect, deleteRecurring);
router.post('/:id/pay', protect, payRecurring);

module.exports = router;