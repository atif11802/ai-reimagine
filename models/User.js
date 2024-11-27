const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const getUserCredits = require("../utils/getUserCredits.js");

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: false }, // Will be empty if the user signs up with Google
	googleId: { type: String, required: false },
	refreshToken: { type: String, required: false }, // Store refresh tokens
	isVerified: { type: Boolean, default: false }, // Email verification status
	isAdmin: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	profile_pic: { type: String, required: false },
});

// Password hashing before saving a new user
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Password comparison method
UserSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual property for available credit
// UserSchema.virtual('availableCredits').get(async function () {
// 	const credits = await getUserCredits(this._id.toString());
// 	console.log(credits);
// 	// return credits;
// 	return 0;
// });

// // Ensure virtual fields are serialized
// UserSchema.set('toJSON', { virtuals: true });
// UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
