// routes/protectedPlanRoutes.js
const express = require('express');
const router = express.Router();
const adminProtect = require('../../middlewares/adminProtect');
const createPlan = require('../../controllers/plan/createPlan.js');
const updatePlanById = require('../../controllers/plan/updatePlanById.js');
const deletePlanById = require('../../controllers/plan/deletePlanById.js');

// Create a new plan (Protected)
router.post('/', adminProtect, createPlan);

// Update a plan by ID (Protected)
router.put('/:id', adminProtect, updatePlanById);

// Delete a plan by ID (Protected)
router.delete('/:id', adminProtect, deletePlanById);


module.exports = router;
