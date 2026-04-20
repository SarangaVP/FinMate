const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const buildMonthBuckets = (months) => {
    const now = new Date();
    const buckets = [];

    for (let index = months - 1; index >= 0; index -= 1) {
        const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
        buckets.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            label: date.toLocaleString('en-LK', { month: 'short', year: 'numeric' })
        });
    }

    return buckets;
};

const getAnalytics = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const monthsParam = Number(req.query.months);
        const months = Number.isFinite(monthsParam) && monthsParam > 0 ? Math.min(monthsParam, 24) : 6;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (months - 1));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const [summaryRaw, categoryRaw, monthlyRaw, dailyExpenseRaw] = await Promise.all([
            Transaction.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Transaction.aggregate([
                {
                    $match: {
                        userId,
                        type: 'expense',
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { total: -1 } }
            ]),
            Transaction.aggregate([
                {
                    $match: {
                        userId,
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' },
                            type: '$type'
                        },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Transaction.aggregate([
                {
                    $match: {
                        userId,
                        type: 'expense',
                        date: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' },
                            day: { $dayOfMonth: '$date' }
                        },
                        total: { $sum: '$amount' }
                    }
                },
                { $sort: { total: -1 } },
                { $limit: 1 }
            ])
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        let totalTransactions = 0;

        summaryRaw.forEach((row) => {
            totalTransactions += row.count || 0;
            if (row._id === 'income') {
                totalIncome = row.total || 0;
            }
            if (row._id === 'expense') {
                totalExpense = row.total || 0;
            }
        });

        const balance = totalIncome - totalExpense;

        const categories = categoryRaw.map((row) => ({
            category: row._id || 'Uncategorized',
            total: row.total || 0,
            count: row.count || 0
        }));

        const monthBuckets = buildMonthBuckets(months);
        const monthlyMap = new Map();

        monthlyRaw.forEach((row) => {
            const key = `${row._id.year}-${row._id.month}`;
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, { income: 0, expense: 0 });
            }
            const bucket = monthlyMap.get(key);
            if (row._id.type === 'income') {
                bucket.income = row.total || 0;
            }
            if (row._id.type === 'expense') {
                bucket.expense = row.total || 0;
            }
        });

        const monthlyTrend = monthBuckets.map((bucket) => {
            const key = `${bucket.year}-${bucket.month}`;
            const data = monthlyMap.get(key) || { income: 0, expense: 0 };
            return {
                label: bucket.label,
                income: data.income,
                expense: data.expense
            };
        });

        const topCategory = categories[0]?.category || 'N/A';
        const topCategorySpend = categories[0]?.total || 0;

        const mostExpensiveDay = dailyExpenseRaw[0]
            ? new Date(dailyExpenseRaw[0]._id.year, dailyExpenseRaw[0]._id.month - 1, dailyExpenseRaw[0]._id.day).toLocaleDateString('en-LK', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
            : 'N/A';

        return res.json({
            summary: {
                totalIncome,
                totalExpense,
                balance,
                totalTransactions
            },
            categories,
            monthlyTrend,
            insights: {
                topCategory,
                topCategorySpend,
                mostExpensiveDay
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAnalytics
};
