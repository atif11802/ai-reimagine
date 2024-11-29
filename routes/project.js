const express = require("express");
const userProtect = require("../middlewares/userProtect.js");
const router = express.Router();

const addToProject = require("../controllers/project/addToProject.js");
const getProjectById = require("../controllers/project/getProjectById.js");
const getAllProjects = require("../controllers/project/getAllProjects.js");
const getAllProjectNames = require("../controllers/project/getAllProjectNames.js");

router.get("/all", userProtect, getAllProjects);
router.get("/all-name", userProtect, getAllProjectNames);
router.put("/", userProtect, addToProject);
router.get("/:id", userProtect, getProjectById);

module.exports = router;
