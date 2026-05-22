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

router.get('/', protect, getGroups);
router.get('/:id', protect, getGroupById);
router.get('/:id/balances', protect, getGroupBalances);
router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.post('/add-member', protect, addMember);
router.delete('/remove-member', protect, removeMember);
router.put('/:id', protect, updateGroup);
router.post('/:id/settle', protect, settleBalance);
router.delete('/:id', protect, deleteGroup);

module.exports = router;
