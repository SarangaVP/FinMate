const Transaction = require('../models/Transaction');
const { analyzeTransaction } = require('../services/aiService');

// @desc    Create a new transaction with AI categorization
// @route   POST /api/transactions
exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, type, groupId, goalId } = req.body;

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