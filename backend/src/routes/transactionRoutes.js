const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions, updateTransaction, deleteTransaction, getDashboardSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/summary', protect, getDashboardSummary);
router.post('/', protect, createTransaction);
router.get('/', protect, getTransactions);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;