const Budget = require('../models/Budget');
const SavingGoal = require('../models/SavingGoal');
const Transaction = require('../models/Transaction');

const parseAmount = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json(budgets);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createBudget = async (req, res) => {
    try {
        const { category, spendingLimit, timeFrame } = req.body;
        const parsedLimit = parseAmount(spendingLimit);

        if (!category || !category.trim()) {
            return res.status(400).json({ error: 'Category is required' });
        }

        if (parsedLimit === null || parsedLimit <= 0) {
            return res.status(400).json({ error: 'Spending limit must be greater than 0' });
        }

        // Check for duplicate budget with same category and timeFrame
        const existingBudget = await Budget.findOne({
            userId: req.user._id,
            category: category.trim(),
            timeFrame: timeFrame || 'Monthly'
        });

        if (existingBudget) {
            return res.status(400).json({ 
                error: `Budget for "${category}" already exists for ${timeFrame || 'Monthly'} timeframe` 
            });
        }

        // Calculate current spending for the time period
        const getDateRangeForTimeFrame = (tf) => {
            const now = new Date();
            let startDate, endDate;

            if (tf === 'Weekly') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                startDate = new Date(now.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
            } else if (tf === 'Monthly') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
            } else if (tf === 'Yearly') {
                startDate = new Date(now.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), 11, 31);
                endDate.setHours(23, 59, 59, 999);
            }
            return { startDate, endDate };
        };

        const Transaction = require('../models/Transaction');
        const { startDate, endDate } = getDateRangeForTimeFrame(timeFrame || 'Monthly');

        const transactionsInPeriod = await Transaction.find({
            userId: req.user._id,
            category: category.trim(),
            type: 'expense',
            date: { $gte: startDate, $lte: endDate }
        });

        const currentSpending = transactionsInPeriod.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

        const budget = await Budget.create({
            userId: req.user._id,
            category: category.trim(),
            spendingLimit: parsedLimit,
            timeFrame: timeFrame || 'Monthly',
            currentSpending
        });

        return res.status(201).json(budget);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, spendingLimit, timeFrame, currentSpending } = req.body;

        const budget = await Budget.findOne({ _id: id, userId: req.user._id });
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        // If category or timeFrame is being changed, check for duplicates
        if (category !== undefined || timeFrame !== undefined) {
            const newCategory = category !== undefined ? String(category).trim() : budget.category;
            const newTimeFrame = timeFrame !== undefined ? timeFrame : budget.timeFrame;

            if (!newCategory) {
                return res.status(400).json({ error: 'Category cannot be empty' });
            }

            // Check for duplicate only if category or timeFrame changed
            if (newCategory !== budget.category || newTimeFrame !== budget.timeFrame) {
                const existingBudget = await Budget.findOne({
                    userId: req.user._id,
                    _id: { $ne: id },
                    category: newCategory,
                    timeFrame: newTimeFrame
                });

                if (existingBudget) {
                    return res.status(400).json({ 
                        error: `Budget for "${newCategory}" already exists for ${newTimeFrame} timeframe` 
                    });
                }
            }

            budget.category = newCategory;
            budget.timeFrame = newTimeFrame;
        }

        if (spendingLimit !== undefined) {
            const parsedLimit = parseAmount(spendingLimit);
            if (parsedLimit === null || parsedLimit <= 0) {
                return res.status(400).json({ error: 'Spending limit must be greater than 0' });
            }
            budget.spendingLimit = parsedLimit;
        }

        // Recalculate current spending for the time period
        if (category !== undefined || timeFrame !== undefined) {
            const getDateRangeForTimeFrame = (tf) => {
                const now = new Date();
                let startDate, endDate;

                if (tf === 'Weekly') {
                    const day = now.getDay();
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                    startDate = new Date(now.setDate(diff));
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 6);
                    endDate.setHours(23, 59, 59, 999);
                } else if (tf === 'Monthly') {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    endDate.setHours(23, 59, 59, 999);
                } else if (tf === 'Yearly') {
                    startDate = new Date(now.getFullYear(), 0, 1);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now.getFullYear(), 11, 31);
                    endDate.setHours(23, 59, 59, 999);
                }
                return { startDate, endDate };
            };

            const Transaction = require('../models/Transaction');
            const { startDate, endDate } = getDateRangeForTimeFrame(budget.timeFrame);

            const transactionsInPeriod = await Transaction.find({
                userId: req.user._id,
                category: budget.category,
                type: 'expense',
                date: { $gte: startDate, $lte: endDate }
            });

            const calculatedSpending = transactionsInPeriod.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            budget.currentSpending = calculatedSpending;
        } else if (currentSpending !== undefined) {
            const parsedSpending = parseAmount(currentSpending);
            if (parsedSpending === null || parsedSpending < 0) {
                return res.status(400).json({ error: 'Current spending must be 0 or more' });
            }
            budget.currentSpending = parsedSpending;
        }

        const updatedBudget = await budget.save();
        return res.json(updatedBudget);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedBudget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        return res.json({ message: 'Budget deleted successfully', id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getSavingGoals = async (req, res) => {
    try {
        const goals = await SavingGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json(goals);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const createSavingGoal = async (req, res) => {
    try {
        const { goalName, targetValue, currentSavedAmount, targetDate } = req.body;
        const parsedTargetValue = parseAmount(targetValue);
        const parsedSavedAmount = currentSavedAmount === undefined ? 0 : parseAmount(currentSavedAmount);

        if (!goalName || !goalName.trim()) {
            return res.status(400).json({ error: 'Goal name is required' });
        }

        if (parsedTargetValue === null || parsedTargetValue <= 0) {
            return res.status(400).json({ error: 'Target value must be greater than 0' });
        }

        if (parsedSavedAmount === null || parsedSavedAmount < 0) {
            return res.status(400).json({ error: 'Current saved amount must be 0 or more' });
        }

        const goal = await SavingGoal.create({
            userId: req.user._id,
            goalName: goalName.trim(),
            targetValue: parsedTargetValue,
            currentSavedAmount: parsedSavedAmount,
            targetDate: targetDate || undefined
        });

        return res.status(201).json(goal);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updateSavingGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { goalName, targetValue, currentSavedAmount, targetDate } = req.body;

        const goal = await SavingGoal.findOne({ _id: id, userId: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Saving goal not found' });
        }

        if (goalName !== undefined) {
            if (!String(goalName).trim()) {
                return res.status(400).json({ error: 'Goal name cannot be empty' });
            }
            goal.goalName = String(goalName).trim();
        }

        if (targetValue !== undefined) {
            const parsedTargetValue = parseAmount(targetValue);
            if (parsedTargetValue === null || parsedTargetValue <= 0) {
                return res.status(400).json({ error: 'Target value must be greater than 0' });
            }
            goal.targetValue = parsedTargetValue;
        }

        if (currentSavedAmount !== undefined) {
            const parsedSavedAmount = parseAmount(currentSavedAmount);
            if (parsedSavedAmount === null || parsedSavedAmount < 0) {
                return res.status(400).json({ error: 'Current saved amount must be 0 or more' });
            }
            goal.currentSavedAmount = parsedSavedAmount;
        }

        if (targetDate !== undefined) {
            goal.targetDate = targetDate || null;
        }

        const updatedGoal = await goal.save();
        return res.json(updatedGoal);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const contributeToGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const parsedAmount = parseAmount(amount);

        if (parsedAmount === null || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Contribution amount must be greater than 0' });
        }

        const goal = await SavingGoal.findOne({ _id: id, userId: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Saving goal not found' });
        }

        goal.currentSavedAmount += parsedAmount;
        const updatedGoal = await goal.save();

        try {
            await Transaction.create({
                userId: req.user._id,
                amount: parsedAmount,
                description: `Contribution to goal: ${goal.goalName}`,
                category: 'Goal',
                type: 'expense',
                date: new Date()
            });
        } catch (transactionError) {
            goal.currentSavedAmount = Math.max(0, goal.currentSavedAmount - parsedAmount);
            await goal.save();
            return res.status(500).json({ error: transactionError.message });
        }

        return res.json(updatedGoal);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteSavingGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGoal = await SavingGoal.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!deletedGoal) {
            return res.status(404).json({ error: 'Saving goal not found' });
        }

        return res.json({ message: 'Saving goal deleted successfully', id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getSavingGoals,
    createSavingGoal,
    updateSavingGoal,
    contributeToGoal,
    deleteSavingGoal
};