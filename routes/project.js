const express = require("express");
const userProtect = require("../middlewares/userProtect.js");
const router = express.Router();

const addToProject = require("../controllers/project/addToProject.js");
const getProjectById = require("../controllers/project/getProjectById.js");
const getAllProjects = require("../controllers/project/getAllProjects.js");

router.get("/all", userProtect, getAllProjects);
router.get("/:id", userProtect, getProjectById);
router.put("/", userProtect, addToProject);

module.exports = router;
