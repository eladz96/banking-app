const express = require('express');
const { newTransaction, getTransactions } = require('../controllers/transactionController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, newTransaction);
router.get('/', authenticateJWT, getTransactions);

module.exports = router;
