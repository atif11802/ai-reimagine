const express = require('express');
const adminProtect = require('../../middlewares/adminProtect.js');
const AddUserCredit = require('../../controllers/credit/AddUserCredit.js');
const router = express.Router();

router.post("/", adminProtect, AddUserCredit)

module.exports = router;