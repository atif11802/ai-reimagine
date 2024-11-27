const express = require('express');
const adminProtect = require('../../middlewares/adminProtect.js');
const makeAdmin = require('../../controllers/admin/makeAdmin.js');
const getAllAdmins = require('../../controllers/admin/getAllAdmins.js');
const createAdmin = require('../../controllers/admin/createAdmin.js');
const router = express.Router();

// Make a user an admin (Protected - Admins only)
router.put('/make-admin/:id', adminProtect, makeAdmin);
router.post('/create', adminProtect, createAdmin);

// Get all admins (Protected - Admins only)
router.get('/admins', adminProtect, getAllAdmins);


module.exports = router;

