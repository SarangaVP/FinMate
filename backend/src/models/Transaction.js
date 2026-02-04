const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Uncategorized' },
    type: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, default: Date.now },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);