const mongoose = require('mongoose');

const SettlementSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGroup', required: true },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Settlement', SettlementSchema);