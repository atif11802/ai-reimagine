const User = require('../../models/User.js');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../../utils/jwt.js');

const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken)
		return res.status(401).json({ message: 'Refresh token is required' });

	try {
		// Verify the refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
		console.log('decoded: ', decoded);
		const user = await User.findById(decoded.id);

		if (!user || user.refreshToken !== refreshToken) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}

		// Generate new access and refresh tokens
		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);

		// Update the user's refresh token in the database
		user.refreshToken = newRefreshToken;
		await user.save();

		return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (error) {
		console.log(error)
		return res.status(403).json({ message: 'Refresh token is invalid or expired' });
	}
};
