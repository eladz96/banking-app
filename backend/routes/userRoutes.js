
const express = require('express');
const { registerUser, verifyOTP, loginUser, getBalance } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', registerUser);
router.post('/verification', verifyOTP);
router.post('/login', loginUser);
router.get('/:user_id/balance', authenticateJWT, getBalance);

module.exports = router;
