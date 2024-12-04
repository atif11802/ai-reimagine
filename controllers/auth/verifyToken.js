const User = require("../../models/User.js");
const UserVerification = require("../../models/UserVerification.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwt.js");

module.exports = async (req, res) => {
	const { token } = req.params;
	try {
		const userVerification = await UserVerification.findOne({
			token,
			isExpired: false,
		}).populate("user");

		if (!userVerification) {
			throw new Error("Invalid or expired token");
		}

		const user = await User.findById(userVerification.user._id);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.isVerified = true;
		userVerification.isExpired = true;

		await userVerification.save();
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Save refresh token in the database
		user.refreshToken = refreshToken;
		await user.save();

		return res.status(200).json({
			message: "User registered successfully",
			accessToken,
			refreshToken,
		});
	} catch (err) {
		if (err instanceof Error) {
			return res.status(400).json({ message: err.message });
		}
		return res.status(500).json({ message: err.message });
	}
};
