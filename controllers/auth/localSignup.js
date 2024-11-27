const User = require("../../models/User.js");
const UserVerification = require("../../models/UserVerification.js");
const sendEmail = require("../../utils/sendMail.js");
const { generateAccessToken } = require("../../utils/jwt.js");

module.exports = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "Email already exists" });

		user = new User({ email, password, name });
		await user.save();

		const token = generateAccessToken(user);
		const userVerication = new UserVerification({
			user: user._id,
			token,
		});
		await userVerication.save();

		// do smtp otp verification here then implement below
		const text = `Click <a href="${process.env.BACKEND_URL}/api/auth/verify/${token}">here</a> to verify your email.`;
		const html = `<p>Click <a href="${process.env.BACKEND_URL}/api/auth/verify/${token}">here</a> to verify your email.</p>`;
		const mailsended = await sendEmail(
			user.email,
			"Verify Your Email",
			text,
			html
		);
		if (!mailsended)
			return res
				.status(500)
				.json({ message: "Error sending verification email" });

		return res.status(201).json({
			message: "Please check your email for verification link",
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};
