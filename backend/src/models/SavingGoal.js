const mongoose = require('mongoose');

const SavingGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goalName: { type: String, required: true },
    targetValue: { type: Number, required: true },
    currentSavedAmount: { type: Number, default: 0 },
    targetDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SavingGoal', SavingGoalSchema);