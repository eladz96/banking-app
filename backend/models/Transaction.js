const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: { type: String, required: true },       // email
    recipient: { type: String, required: true },    // email
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
