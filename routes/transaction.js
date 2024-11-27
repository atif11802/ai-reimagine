// routes/transaction.js
const express = require('express');
const router = express.Router();
const userProtect = require('../middlewares/userProtect');

const createTransaction = require('../controllers/transaction/createTransaction.js');
const getUsersAllTransaction = require('../controllers/transaction/getUsersAllTransaction.js');
const getUsersSingleTransaction = require('../controllers/transaction/getUsersSingleTransaction.js');
const updateUsersTransaction = require('../controllers/transaction/updateUsersTransaction.js');
const deleteUsersTransaction = require('../controllers/transaction/deleteUsersTransaction.js');

// Create a new transaction
router.post('/', userProtect, createTransaction);

// Get all transactions for the authenticated user
router.get('/', userProtect, getUsersAllTransaction);

// Get a single transaction by ID for the authenticated user
router.get('/:id', userProtect, getUsersSingleTransaction);

// Update a transaction by ID for the authenticated user
// router.put('/:id', userProtect, updateUsersTransaction);

// Delete a transaction by ID for the authenticated user
// router.delete('/:id', userProtect, deleteUsersTransaction);

module.exports = router;
