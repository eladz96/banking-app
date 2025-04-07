const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { name, email, password, phone, balance } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            balance: balance !== undefined ? balance : undefined
        });

        res.status(201).json({
            message: "User registered successfully",
            assignedBalance: user.balance
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email , name: user.name}, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ balance: user.balance });
    } catch (err) {
        res.status(500).json({ message: "Failed to get balance", error: err.message });
    }
};
