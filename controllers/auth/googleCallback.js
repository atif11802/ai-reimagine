const UserVerification = require("../../models/UserVerification.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwt.js");
module.exports = async (req, res) => {
	try {
		const accessToken = generateAccessToken(req.user);
		const refreshToken = generateRefreshToken(req.user);
		// Save refresh token in the database
		req.user.refreshToken = refreshToken;
		await req.user.save();

		// Find or create user verification
		let userVerification = await UserVerification.findOne({
			user: req.user._id,
		});

		if (!userVerification) {
			userVerification = new UserVerification({
				user: req.user._id,
				token: accessToken,
				createdAt: new Date(),
				isExpired: false,
			});
			await userVerification.save();
		} else {
			userVerification.token = accessToken;
			userVerification.isExpired = false;
			await userVerification.save();
		}

		console.log("User verification:", userVerification);

		// Redirect to verification frontend page
		return res.redirect(
			`${process.env.FRONTEND_URL}/verify-email?token=${accessToken}`
		);
	} catch (error) {
		console.error("Error in user verification:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
