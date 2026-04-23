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

// Get all expenses for a group
router.get('/group/:groupID', protect, getGroupExpenses);

// Get a specific expense
router.get('/:id', protect, getExpenseById);

// Get balance calculations for a group
router.get('/balance/:groupID', protect, calculateGroupBalance);

// Add a new expense
router.post('/', protect, addExpense);

// Update an expense
router.put('/:id', protect, updateExpense);

// Delete an expense
router.delete('/:id', protect, deleteExpense);

module.exports = router;
