const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
	url: { type: String, required: 'true' },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
