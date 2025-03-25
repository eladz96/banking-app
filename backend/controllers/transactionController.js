const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.newTransaction = async (req, res) => {
    const { recipientEmail, amount } = req.body;
    const senderEmail = req.user.email;

    if (!(amount > 0)) {
        return res.status(400).json({ message: "Illegal amount" });
    }

    try {
        const sender = await User.findOne({ email: senderEmail });
        const recipient = await User.findOne({ email: recipientEmail });

        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Update balances
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        const transaction = await Transaction.create({
            sender: sender.email,
            recipient: recipient.email,
            amount
        });

        res.status(201).json({ message: "Transaction successful", transaction });

    } catch (err) {
        res.status(500).json({ message: "Transaction failed", error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    const userEmail = req.user.email;

    try {
        const txns = await Transaction.find({
            $or: [{ sender: userEmail }, { recipient: userEmail }]
        }).sort({ timestamp: -1 });

        res.json(txns);
    } catch (err) {
        res.status(500).json({ message: "Failed to get transactions", error: err.message });
    }
};
