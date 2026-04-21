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
    getGroupBalances
} = require('../controllers/sharedGroupController');

// Get all groups for the user
router.get('/', protect, getGroups);

// Get a specific group
router.get('/:id', protect, getGroupById);

// Get balances for a group
router.get('/:id/balances', protect, getGroupBalances);

// Create a new group
router.post('/', protect, createGroup);

// Join an existing group
router.post('/join', protect, joinGroup);

// Add a member to a group
router.post('/add-member', protect, addMember);

// Remove a member from a group
router.delete('/remove-member', protect, removeMember);

// Update group name
router.put('/:id', protect, updateGroup);

// Settle a balance
router.post('/:id/settle', protect, settleBalance);

// Delete a group
router.delete('/:id', protect, deleteGroup);

module.exports = router;
