const Budget = require('../models/Budget');
const SavingGoal = require('../models/SavingGoal');

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

        const budget = await Budget.create({
            userId: req.user._id,
            category: category.trim(),
            spendingLimit: parsedLimit,
            timeFrame
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

        if (category !== undefined) {
            if (!String(category).trim()) {
                return res.status(400).json({ error: 'Category cannot be empty' });
            }
            budget.category = String(category).trim();
        }

        if (spendingLimit !== undefined) {
            const parsedLimit = parseAmount(spendingLimit);
            if (parsedLimit === null || parsedLimit <= 0) {
                return res.status(400).json({ error: 'Spending limit must be greater than 0' });
            }
            budget.spendingLimit = parsedLimit;
        }

        if (timeFrame !== undefined) {
            budget.timeFrame = timeFrame;
        }

        if (currentSpending !== undefined) {
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