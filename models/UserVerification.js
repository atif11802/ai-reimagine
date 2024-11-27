const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserVerificationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	isExpired: {
		type: Boolean,
		required: true,
		default: false,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

module.exports = mongoose.model('UserVerification', UserVerificationSchema);
