const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    spendingLimit: { type: Number, required: true },
    timeFrame: { type: String, enum: ['Weekly', 'Monthly', 'Yearly'], default: 'Monthly' },
    currentSpending: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);