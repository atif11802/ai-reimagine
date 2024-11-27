const express = require('express');
const getAllUsers = require('../../controllers/user/getAllUsers.js');
const adminProtect = require('../../middlewares/adminProtect.js');
const getSingleUser = require('../../controllers/user/getSingleUser.js');
const updateUser = require('../../controllers/user/updateUser.js');
const deleteUser = require('../../controllers/user/deleteUser.js');
const router = express.Router();

// Get all users
router.get('/', adminProtect, getAllUsers);

// Get a single user by ID
router.get('/:id', adminProtect, getSingleUser);

// Update user by ID (Protected)
router.put('/:id', adminProtect, updateUser);

// Delete user by ID (Protected)
router.delete('/:id', adminProtect, deleteUser);

module.exports = router;
