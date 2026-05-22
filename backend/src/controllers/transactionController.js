const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { analyzeTransaction } = require('../services/aiService');
const mongoose = require('mongoose');

const escapeRegExp = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getDateRangeForTimeFrame = (timeFrame, date = new Date()) => {
    const currentDate = new Date(date);
    let startDate, endDate;

    if (timeFrame === 'Weekly') {
        // Get start of current week (Monday)
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(currentDate.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        
        // End of week (Sunday)
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    } else if (timeFrame === 'Monthly') {
        // Start of current month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        
        // End of current month
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
    } else if (timeFrame === 'Yearly') {
        // Start of current year
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        
        // End of current year
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
};

const adjustBudgetsForTransaction = async (userId, transaction, direction = 1) => {
    if (!transaction || transaction.type !== 'expense' || !transaction.category) {
        return;
    }

    const amount = Number(transaction.amount) * direction;
    if (!Number.isFinite(amount) || amount === 0) {
        return;
    }

    const budgets = await Budget.find({
        userId,
        category: new RegExp(`^${escapeRegExp(transaction.category)}$`, 'i')
    });

    for (const budget of budgets) {
        // Calculate spending only for the current time period
        const { startDate, endDate } = getDateRangeForTimeFrame(budget.timeFrame, transaction.date);

        const transactionsInPeriod = await Transaction.find({
            userId,
            category: new RegExp(`^${escapeRegExp(transaction.category)}$`, 'i'),
            type: 'expense',
            date: { $gte: startDate, $lte: endDate }
        });

        const totalSpending = transactionsInPeriod.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

        budget.currentSpending = Math.max(0, totalSpending);
        await budget.save();
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { amount, description, type, date, groupId } = req.body;

        const aiResult = await analyzeTransaction(description);
        const category = aiResult.category || 'Uncategorized';

        const transaction = new Transaction({
            userId: req.user._id,
            amount,
            description,
            category,
            type,
            date: date || Date.now(),
            groupId
        });

        const savedTransaction = await transaction.save();

        await adjustBudgetsForTransaction(req.user._id, savedTransaction, 1);

        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, type, category, date } = req.body;

        const transaction = await Transaction.findOne({ _id: id, userId: req.user._id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const previousTransaction = transaction.toObject();

        if (amount !== undefined) transaction.amount = amount;
        if (description !== undefined) transaction.description = description;
        if (type !== undefined) transaction.type = type;
        if (category !== undefined) transaction.category = category;
        if (date !== undefined) transaction.date = date;

        const updatedTransaction = await transaction.save();

        await adjustBudgetsForTransaction(req.user._id, previousTransaction, -1);
        await adjustBudgetsForTransaction(req.user._id, updatedTransaction, 1);

        res.json(updatedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findOneAndDelete({ _id: id, userId: req.user._id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await adjustBudgetsForTransaction(req.user._id, transaction, -1);

        res.json({ message: 'Transaction deleted successfully', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const summary = await Transaction.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach(item => {
            if (item._id === 'income') {
                totalIncome = item.total;
            } else if (item._id === 'expense') {
                totalExpense = item.total;
            }
        });

        const balance = totalIncome - totalExpense;

        res.json({
            totalIncome,
            totalExpense,
            balance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};