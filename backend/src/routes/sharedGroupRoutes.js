const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getGroups,
    getGroupById,
    createGroup,
    joinGroup,
    addMember,
    removeMember,
    updateGroup,
    deleteGroup,
    settleBalance,
    getGroupBalances,
    addSharedExpense,
    getGroupExpenses
} = require('../controllers/sharedGroupController');

// Get all groups for the user
router.get('/', protect, getGroups);

// Get balances for a group (must come before /:id route)
router.get('/:id/balances', protect, getGroupBalances);

// Get expenses for a group (must come before /:id route)
router.get('/:id/expenses', protect, getGroupExpenses);

// Get a specific group (must come last among GET routes with :id)
router.get('/:id', protect, getGroupById);

// Create a new group
router.post('/', protect, createGroup);

// Join an existing group
router.post('/join', protect, joinGroup);

// Add a shared expense (must come before other /:id POST routes)
router.post('/:id/add-expense', protect, addSharedExpense);

// Settle a balance (must come before other /:id POST routes)
router.post('/:id/settle', protect, settleBalance);

// Add a member to a group
router.post('/add-member', protect, addMember);

// Remove a member from a group
router.delete('/remove-member', protect, removeMember);

// Update group name
router.put('/:id', protect, updateGroup);

// Delete a group
router.delete('/:id', protect, deleteGroup);

module.exports = router;
