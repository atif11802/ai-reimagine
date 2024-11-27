const express = require('express');
const router = express.Router();
const adminPlanRoute = require('./plan.js');
const adminRoute = require('./admin.js');
const adminPromoRoute = require('./promo.js');
const userRoute = require('./user.js');
const creditRoute = require('./credit.js');
const transactionRoute = require('./transaction.js');

router.use('/plan', adminPlanRoute);
router.use('/promo', adminPromoRoute);
router.use('/user', userRoute);
router.use('/credit', creditRoute);
router.use('/transaction', transactionRoute);
router.use('/', adminRoute);

module.exports = router;
