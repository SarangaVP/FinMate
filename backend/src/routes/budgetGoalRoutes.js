const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getSavingGoals,
    createSavingGoal,
    updateSavingGoal,
    contributeToGoal,
    deleteSavingGoal
} = require('../controllers/budgetGoalController');

router.get('/budgets', protect, getBudgets);
router.post('/budgets', protect, createBudget);
router.put('/budgets/:id', protect, updateBudget);
router.delete('/budgets/:id', protect, deleteBudget);

router.get('/goals', protect, getSavingGoals);
router.post('/goals', protect, createSavingGoal);
router.put('/goals/:id', protect, updateSavingGoal);
router.put('/goals/:id/contribute', protect, contributeToGoal);
router.delete('/goals/:id', protect, deleteSavingGoal);

module.exports = router;