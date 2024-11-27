// routes/protectedPromoRoutes.js
const express = require('express');
const adminProtect = require('../../middlewares/adminProtect.js');
const createPromo = require('../../controllers/promo/createPromo.js');
const updatePromo = require('../../controllers/promo/updatePromo.js');
const deletePromo = require('../../controllers/promo/deletePromo.js');
const getAllPromos = require('../../controllers/promo/getAllPromos.js');
const getSinglePromoById = require('../../controllers/promo/getSinglePromoById.js');
const router = express.Router();

// Create a new promo (Protected)
router.post('/', adminProtect, createPromo);

// Update a promo by ID (Protected)
router.put('/:id', adminProtect, updatePromo);

// Delete a promo by ID (Protected)
router.delete('/:id', adminProtect, deletePromo);

// Get all promos
router.get('/', adminProtect, getAllPromos);

// Get a single promo by ID 
router.get('/:id', adminProtect, getSinglePromoById);

module.exports = router;
