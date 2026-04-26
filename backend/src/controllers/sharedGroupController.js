const SharedGroup = require('../models/SharedGroup');
const User = require('../models/User');
const Settlement = require('../models/Settlement');

// Get all groups for the current user
exports.getGroups = async (req, res) => {
    try {
        const groups = await SharedGroup.find({ memberIDs: req.user.id })
            .populate('memberIDs', 'name email');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
};

// Get a specific group by ID
exports.getGroupById = async (req, res) => {
    try {
        const group = await SharedGroup.findById(req.params.id)
            .populate('memberIDs', 'name email');
        
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Get settlements for this group
        const settlements = await Settlement.find({ groupID: req.params.id })
            .populate('fromUser toUser', 'name email');

        res.status(200).json({ ...group.toObject(), settlements });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group', error: error.message });
    }
};

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { groupName, memberEmails } = req.body;

        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        // Start with the creator
        const memberIDs = [req.user.id];

        // Add other members if emails are provided
        if (memberEmails && Array.isArray(memberEmails)) {
            const members = await User.find({ email: { $in: memberEmails } }, '_id');
            memberIDs.push(...members.map(m => m._id));
        }

        const group = new SharedGroup({
            groupName,
            memberIDs: [...new Set(memberIDs)], // Remove duplicates
        });

        await group.save();
        await group.populate('memberIDs', 'name email');

        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
};

// Join an existing group (by group ID)
exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is already a member
        if (group.memberIDs.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are already a member of this group' });
        }

        group.memberIDs.push(req.user.id);
        await group.save();
        await group.populate('memberIDs', 'name email');

        res.status(200).json({ message: 'Successfully joined the group', group });
    } catch (error) {
        res.status(500).json({ message: 'Error joining group', error: error.message });
    }
};

// Add a member to a group (by email)
exports.addMember = async (req, res) => {
    try {
        const { groupId, email } = req.body;

        if (!groupId || !email) {
            return res.status(400).json({ message: 'Group ID and email are required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member of the group
        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already a member
        if (group.memberIDs.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a member of this group' });
        }

        group.memberIDs.push(user._id);
        await group.save();
        await group.populate('memberIDs', 'name email');

        res.status(200).json({ message: 'Member added successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member', error: error.message });
    }
};

// Remove a member from a group
exports.removeMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.body;

        if (!groupId || !memberId) {
            return res.status(400).json({ message: 'Group ID and member ID are required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Remove the member
        group.memberIDs = group.memberIDs.filter(id => id.toString() !== memberId);
        await group.save();
        await group.populate('memberIDs', 'name email');

        res.status(200).json({ message: 'Member removed successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error removing member', error: error.message });
    }
};

// Update group name
exports.updateGroup = async (req, res) => {
    try {
        const { groupId, groupName } = req.body;

        if (!groupId || !groupName) {
            return res.status(400).json({ message: 'Group ID and name are required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        group.groupName = groupName;
        await group.save();
        await group.populate('memberIDs', 'name email');

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error updating group', error: error.message });
    }
};

// Delete a group (only creator or any member?)
exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(400).json({ message: 'Group ID is required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Delete related settlements
        await Settlement.deleteMany({ groupID: groupId });

        // Delete the group
        await SharedGroup.findByIdAndDelete(groupId);

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    }
};

// Settle a balance between two members
exports.settleBalance = async (req, res) => {
    try {
        const { groupId, fromUserId, toUserId, amount } = req.body;

        if (!groupId || !fromUserId || !toUserId || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const group = await SharedGroup.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Create settlement with new field names
        // fromUserId is the payer (debtor), toUserId is the payee (creditor)
        const settlement = new Settlement({
            groupId: groupId,
            payerId: fromUserId,
            payeeId: toUserId,
            amount,
            status: 'Completed'  // "Mark Settled" button completes the settlement
        });

        await settlement.save();

        res.status(201).json({ message: 'Balance settled successfully', settlement });
    } catch (error) {
        res.status(500).json({ message: 'Error settling balance', error: error.message });
    }
};

// Get group balances (who owes whom)
exports.getGroupBalances = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user.id;

        const group = await SharedGroup.findById(groupId)
            .populate('memberIDs', 'name email primaryCurrency');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.memberIDs.some(member => member._id.toString() === userId)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Get all pending settlements for this group
        const settlements = await Settlement.find({ groupId: groupId, status: 'Pending' })
            .populate('payerId', 'name email primaryCurrency')
            .populate('payeeId', 'name email primaryCurrency');

        // Filter to only include settlements involving group members
        const validSettlements = settlements.filter(s => 
            group.memberIDs.some(m => m._id.toString() === s.payerId._id.toString()) &&
            group.memberIDs.some(m => m._id.toString() === s.payeeId._id.toString())
        );

        // Calculate net balances between pairs of users
        const balanceMap = {};
        group.memberIDs.forEach(member => {
            balanceMap[member._id] = {};
            group.memberIDs.forEach(other => {
                if (member._id.toString() !== other._id.toString()) {
                    balanceMap[member._id][other._id] = 0;
                }
            });
        });

        // For each settlement, track who owes whom
        validSettlements.forEach(settlement => {
            const payerId = settlement.payerId._id.toString();
            const payeeId = settlement.payeeId._id.toString();
            
            // payer owes payee
            if (!balanceMap[payerId][payeeId]) {
                balanceMap[payerId][payeeId] = 0;
            }
            balanceMap[payerId][payeeId] += settlement.amount;
        });

        // Create balance list (only non-zero balances)
        const balances = [];
        Object.keys(balanceMap).forEach(debtorId => {
            Object.keys(balanceMap[debtorId]).forEach(creditorId => {
                if (balanceMap[debtorId][creditorId] > 0) {
                    const debtor = group.memberIDs.find(m => m._id.toString() === debtorId);
                    const creditor = group.memberIDs.find(m => m._id.toString() === creditorId);
                    
                    balances.push({
                        debtor,
                        creditor,
                        amount: balanceMap[debtorId][creditorId],
                        direction: debtorId === userId ? 'owes' : 'owed'
                    });
                }
            });
        });

        res.status(200).json({
            group,
            balances,
            settlements: validSettlements
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group balances', error: error.message });
    }
};
