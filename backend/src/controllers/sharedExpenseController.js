const SharedExpense = require('../models/SharedExpense');
const SharedGroup = require('../models/SharedGroup');
const Settlement = require('../models/Settlement');
const User = require('../models/User');

// Add a new shared expense
exports.addExpense = async (req, res) => {
    try {
        const { groupID, description, amount, splitType, participants, category } = req.body;

        if (!groupID || !description || !amount || !participants) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify user is part of the group
        const group = await SharedGroup.findById(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        // Create the expense
        const expense = new SharedExpense({
            groupID,
            description,
            amount,
            paidBy: req.user.id,
            splitType: splitType || 'equal',
            participants,
            category: category || 'General',
            createdBy: req.user.id
        });

        await expense.save();
        await expense.populate('paidBy', 'name email');
        await expense.populate('participants.userID', 'name email');

        // Create settlements for unpaid amounts
        await createSettlements(expense);

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense', error: error.message });
    }
};

// Create settlement records from an expense
const createSettlements = async (expense) => {
    try {
        // For each participant who is not the payer, create a settlement
        for (const participant of expense.participants) {
            const userId = participant.userID._id || participant.userID;
            
            // Skip if the participant is the payer
            if (userId.toString() === expense.paidBy.toString()) {
                continue;
            }

            // Check if settlement already exists
            const existingSettlement = await Settlement.findOne({
                groupId: expense.groupID,
                payerId: userId,
                payeeId: expense.paidBy,
                status: 'Pending'
            });

            if (existingSettlement) {
                // Update existing settlement
                existingSettlement.amount += participant.amount;
                await existingSettlement.save();
            } else {
                // Create new settlement
                const settlement = new Settlement({
                    groupId: expense.groupID,
                    payerId: userId,
                    payeeId: expense.paidBy,
                    amount: participant.amount,
                    status: 'Pending'
                });
                await settlement.save();
            }
        }
    } catch (error) {
        console.error('Error creating settlements:', error);
    }
};

// Get all expenses for a group
exports.getGroupExpenses = async (req, res) => {
    try {
        const { groupID } = req.params;

        const group = await SharedGroup.findById(groupID);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        const expenses = await SharedExpense.find({ groupID })
            .populate('paidBy', 'name email')
            .populate('participants.userID', 'name email')
            .populate('createdBy', 'name email')
            .sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error: error.message });
    }
};

// Get a specific expense
exports.getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await SharedExpense.findById(id)
            .populate('groupID')
            .populate('paidBy', 'name email')
            .populate('participants.userID', 'name email')
            .populate('createdBy', 'name email');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user has access
        if (!expense.groupID.memberIDs.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You do not have access to this expense' });
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense', error: error.message });
    }
};

// Update an expense
exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, splitType, participants, category } = req.body;

        const expense = await SharedExpense.findById(id)
            .populate('groupID');

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user created this expense or is admin
        if (expense.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only edit your own expenses' });
        }

        // Update fields
        if (description) expense.description = description;
        if (amount) expense.amount = amount;
        if (splitType) expense.splitType = splitType;
        if (participants) expense.participants = participants;
        if (category) expense.category = category;

        await expense.save();
        await expense.populate('paidBy', 'name email');
        await expense.populate('participants.userID', 'name email');

        res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await SharedExpense.findById(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user created this expense
        if (expense.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete your own expenses' });
        }

        // Delete related settlements
        await Settlement.deleteMany({
            groupId: expense.groupID,
            amount: { $exists: true }
        });

        await SharedExpense.findByIdAndDelete(id);

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error: error.message });
    }
};

// Calculate who owes whom based on expenses
exports.calculateGroupBalance = async (req, res) => {
    try {
        const { groupID } = req.params;

        const group = await SharedGroup.findById(groupID)
            .populate('memberIDs', 'name email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.memberIDs.some(member => member._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'You are not a member of this group' });
        }

        const expenses = await SharedExpense.find({ groupID })
            .populate('paidBy', 'name email')
            .populate('participants.userID', 'name email');

        // Calculate balances
        const balances = {};
        group.memberIDs.forEach(member => {
            balances[member._id] = 0;
        });

        expenses.forEach(expense => {
            const paidById = expense.paidBy._id.toString();
            
            expense.participants.forEach(participant => {
                const participantId = participant.userID._id.toString();
                
                if (participantId !== paidById) {
                    // This person owes money to the payer
                    balances[participantId] -= participant.amount;
                    balances[paidById] += participant.amount;
                }
            });
        });

        // Get pending settlements
        const settlements = await Settlement.find({ groupId: expense.groupID, status: 'Pending' })
            .populate('payerId', 'name email')
            .populate('payeeId', 'name email');

        const balanceList = group.memberIDs.map(member => ({
            userID: member._id,
            name: member.name,
            email: member.email,
            balance: balances[member._id] || 0
        }));

        res.status(200).json({
            group,
            balances: balanceList,
            settlements,
            expenses
        });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating balance', error: error.message });
    }
};
