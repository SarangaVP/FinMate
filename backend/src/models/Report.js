const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timeframe: { type: String, required: true },
    insightSummary: { type: String },
    content: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);