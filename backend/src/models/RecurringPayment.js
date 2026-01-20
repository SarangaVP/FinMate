const mongoose = require('mongoose');

const RecurringPaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentType: { type: String, enum: ['Subscription', 'Utility', 'Rent', 'Other'] },
    frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'], required: true },
    nextDueDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('RecurringPayment', RecurringPaymentSchema);