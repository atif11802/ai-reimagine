const express = require("express");
const userProtect = require("../middlewares/userProtect.js");
const router = express.Router();

const addToProject = require("../controllers/image/addToProject.js");
const getProjectById = require("../controllers/image/getProjectById.js");

router.get("/:id", userProtect, getProjectById);
router.put("/", userProtect, addToProject);

module.exports = router;
