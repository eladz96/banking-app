const { users, balances, transactions } = require('../models/dataStore');

exports.newTransaction = (req, res) => {
    const { recipientEmail, amount } = req.body;
    const sender = users.find(u => u.id === req.user.id);
    const recipient = users.find(u => u.email === recipientEmail);

    if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
    }


    if (balances[sender.id] < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: "Illegal amount" });
    }


    balances[sender.id] -= amount;
    balances[recipient.id] += amount;

    const transaction = {
        id: transactions.length + 1,
        sender: sender.email,
        recipient: recipient.email,
        amount,
        timestamp: new Date()
    };

    transactions.push(transaction);
    res.status(201).json({ message: "Transaction successful", transaction });
};

exports.getTransactions = (req, res) => {
    const userTransactions = transactions.filter(
        t => t.sender === req.user.email || t.recipient === req.user.email
    );
    res.json(userTransactions);
};
