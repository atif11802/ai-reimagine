const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transaction/adminTransaction.js');
const adminProtect = require('../../middlewares/adminProtect.js');

// Get all transactions
router.get('/', adminProtect, transactionController.getAllTransactions);

// Get one transaction by ID
router.get('/:id', adminProtect, transactionController.getTransactionById);

// Update one transaction by ID
router.put('/:id', adminProtect, transactionController.updateTransactionById);

module.exports = router;
