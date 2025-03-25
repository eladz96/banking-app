
const express = require('express');
const { registerUser, verifyOTP, loginUser, getBalance } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');
const { checkUserExists } = require('../middleware/userValidation');

const router = express.Router();

router.post('/',checkUserExists ,registerUser);
router.post('/login', loginUser);
router.get('/balance', authenticateJWT, getBalance);

module.exports = router;
