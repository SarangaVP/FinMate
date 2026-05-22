const mongoose = require('mongoose');

const SharedExpenseSchema = new mongoose.Schema({
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGroup', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
    participants: [
        {
            userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            amount: { type: Number, required: true } // Amount owed by or paid by this user
        }
    ],
    category: { type: String, default: 'General' },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SharedExpense', SharedExpenseSchema);
