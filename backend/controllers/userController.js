const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, balances } = require('../models/dataStore'); 

exports.registerUser = async (req, res) => {
    const { email, password, phone, balance } = req.body;  

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
        id: users.length + 1, 
        email, 
        password: hashedPassword, 
        phone 
    };

    users.push(newUser);

    balances[newUser.id] = balance !== undefined ? balance : Math.floor(Math.random() * 10000) + 1000;

    res.status(201).json({ 
        message: "User registered successfully", 
        assignedBalance: balances[newUser.id] 
    });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
};

exports.getBalance = (req, res) => {
    const userId = req.user.id;

    res.json({ balance: balances[userId] || 0 });
};
