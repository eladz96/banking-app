const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, balances } = require('../models/dataStore'); 

exports.registerUser = async (req, res) => {
    const { email, password, phone } = req.body;
    
   
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { 
        id: users.length + 1, 
        email, 
        password: hashedPassword, 
        phone, 
        verified: false, 
        otp: Math.floor(100000 + Math.random() * 900000) 
    };
    
    users.push(newUser);  

    console.log(`OTP for ${email}: ${newUser.otp}`);
    res.status(201).json({ message: "User registered. Verify OTP." });
};

exports.verifyOTP = (req, res) => {
    const { email, otp } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    delete user.otp;

    
    balances[user.id] = Math.floor(Math.random() * 10000) + 1000;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "OTP verified", token });
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
    const userId = parseInt(req.params.user_id);
    res.json({ balance: balances[userId] || 0 });
};
