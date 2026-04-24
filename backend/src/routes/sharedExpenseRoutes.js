const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addExpense,
    getGroupExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    calculateGroupBalance
} = require('../controllers/sharedExpenseController');

router.get('/group/:groupID', protect, getGroupExpenses);
router.get('/:id', protect, getExpenseById);
router.get('/balance/:groupID', protect, calculateGroupBalance);
router.post('/', protect, addExpense);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);

module.exports = router;
