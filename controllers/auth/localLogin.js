const User = require("../../models/User.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwt.js");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
	// Check if credentials are provided
	try {
		const { email, password } = req.body;

		console.log({ email, password });

		if (!email || !password) {
			throw new Error("Email and password are required");
		}

		const user = await User.findOne({ email });
		if (!user) {
			throw new Error("User not found");
		}

		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			throw new Error("Invalid password");
		}

		if (!user.isVerified) {
			throw new Error("User is not verified");
		}

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Save refresh token in the database
		user.refreshToken = refreshToken;
		await user.save();

		return res.json({ accessToken, refreshToken });
	} catch (error) {
		if (error instanceof Error)
			return res.status(400).json({ message: error.message });
		return res.status(500).json({ message: "Internal server error" });
	}
};
