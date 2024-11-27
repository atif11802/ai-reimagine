// routes/unprotectedPlanRoutes.js
const express = require('express');
const getAllPlansByAll = require('../controllers/plan/getAllPlansByAll.js');
const getSinglePlanByAll = require('../controllers/plan/getSinglePlanByAll.js');
const router = express.Router();

// Get all plans (Unprotected)
router.get('/', getAllPlansByAll);

// Get a single plan by ID (Unprotected)
router.get('/:id', getSinglePlanByAll);


module.exports = router;
