const mongoose = require('mongoose');

const SharedGroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    memberIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    totalBalance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SharedGroup', SharedGroupSchema);