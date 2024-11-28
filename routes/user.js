const express = require("express");
const userProtect = require("../middlewares/userProtect");
const updateUser = require("../controllers/user/updateUser");
const router = express.Router();

// Update user by ID (Protected)
router.put("/", userProtect, updateUser);

module.exports = router;
