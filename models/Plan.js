const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
	name: { type: String, required: true },
	title: { type: String, required: true },
	discountText: { type: String, required: false },
	price: { type: Number, required: true },
	displayPrice: { type: Number, required: false },
	currency: { type: String, required: true, default: 'USD' },
	currencySymbol: { type: String, required: true, default: '$' },
	duration: { type: String, required: true, default: 'month' },
	credit: { type: Number, required: true },
	// creditDuration: { type: String, required: true, default: 'month' },
	isPopular: { type: Boolean, required: true, default: false },
	description: { type: String, required: true },
	promo: { type: mongoose.Types.ObjectId, ref: 'Promo', required: false },
	isActive: { type: Boolean, required: true, default: true },
	isCustom: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: Date.now },
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
