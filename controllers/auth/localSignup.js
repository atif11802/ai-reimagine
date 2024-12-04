const User = require("../../models/User.js");
const UserVerification = require("../../models/UserVerification.js");
const sendEmail = require("../../utils/sendMail.js");
const { generateAccessToken } = require("../../utils/jwt.js");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
/**
 * Signs up a new user using local credentials (email, password, name).
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise} A Promise that resolves to the response object.
 */
module.exports = async (req, res) => {
	const { email, password, name } = req.body;

	// Input validation (example)
	if (!email || !password || !name) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		let user = await User.findOne({ email });
		if (user) throw new Error("User already exists");

		// Create new user
		user = new User({ email, password, name });
		await user.save({ session });

		const token = generateAccessToken(user);
		const userVerification = new UserVerification({
			user: user._id,
			token,
		});
		await userVerification.save({ session });

		// Send verification email
		const text = `Thank you for signing up! Please verify your email using this link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`;
		const html = `<p>Thank you for signing up!</p>
      <p><a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Click here</a> to verify your email.</p>`;
		const mail_sended = await sendEmail(
			user.email,
			"Verify Your Email",
			text,
			html
		);

		if (!mail_sended) {
			throw new Error("Failed to send verification email");
		}

		await session.commitTransaction();
		session.endSession();

		return res.status(201).json({
			message: "Please check your email for the verification link",
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();

		if (err instanceof Error) {
			return res.status(400).json({ error: err.message });
		}

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).json({ error: err.message });
		}

		return res.status(500).json({ error: err.message });
	}
};
