// routes/unprotectedPlanRoutes.js
const express = require("express");
const getAllPlansByAll = require("../controllers/plan/getAllPlansByAll.js");
const getSinglePlanByAll = require("../controllers/plan/getSinglePlanByAll.js");
const getCustomPlanInfo = require("../controllers/plan/getCustomPlanInfo.js");
const getCustomPlan = require("../controllers/plan/getCustomPlan.js");

const router = express.Router();

// Get all plans (Unprotected)
router.get("/", getAllPlansByAll);

router.get("/custom-plan", getCustomPlan);

router.post("/custom-plan-info", getCustomPlanInfo);

// Get a single plan by ID (Unprotected)
router.get("/:id", getSinglePlanByAll);

module.exports = router;
