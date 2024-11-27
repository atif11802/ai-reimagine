const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
	name: { type: String, required: true },
	code: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	expiresAt: { type: Date, required: false },
	masimumUse: { type: Number, required: false },
	plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
	deduct: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Promo = mongoose.model('Promo', PromoSchema);
module.exports = Promo;
