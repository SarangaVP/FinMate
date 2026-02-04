const Transaction = require('../models/Transaction');
const { analyzeTransaction } = require('../services/aiService');

// @desc    Create a new transaction with AI categorization
// @route   POST /api/transactions
exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, type, date, groupId, goalId } = req.body;

        // 1. Call Gemini AI Service for categorization
        const aiResult = await analyzeTransaction(description);
        const category = aiResult.category || 'Uncategorized';

        // 2. Create Transaction using the Model
        const transaction = new Transaction({
            userId: req.user, // Provided by protect middleware
            amount,
            description,
            category,
            type,
            date: date || Date.now(),
            groupId,
            goalId
        });

        const savedTransaction = await transaction.save();
        
        // Return transaction with AI-identified category
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, type, date } = req.body;

        // Find transaction and verify ownership
        const transaction = await Transaction.findOne({ _id: id, userId: req.user });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update fields if provided
        if (amount !== undefined) transaction.amount = amount;
        if (description !== undefined) transaction.description = description;
        if (type !== undefined) transaction.type = type;
        if (date !== undefined) transaction.date = date;

        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete transaction, ensuring it belongs to the user
        const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};