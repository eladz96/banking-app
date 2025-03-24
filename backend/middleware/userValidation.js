const User = require('../models/User');

const checkUserExists = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        next(); // ✅ continue to controller
    } catch (err) {
        return res.status(500).json({ message: "Error checking user", error: err.message });
    }
};

module.exports = { checkUserExists };
