const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	creditsEarned: { type: Number, required: true }, // Number of credits earned from the transaction
	transaction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Transaction',
		required: false,
	}, // Reference to the transaction
	status: {
		type: String,
		enum: ['Pending', 'Completed', 'Failed'],
		default: 'Completed',
	},
	createdAt: { type: Date, default: Date.now },
});

const Credit = mongoose.model('Credit', creditSchema);
module.exports = Credit;
