const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
    type: { type: String, enum: ['Budget', 'Goal', 'Payment', 'System'] }
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);