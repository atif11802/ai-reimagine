const User = require('../../models/User.js');
const UserVerification = require('../../models/UserVerification.js');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt.js');

module.exports = async (req, res) => {
	const { token } = req.params;
	try {
		const userVerication = await UserVerification.findOne({
			token,
			isExpired: false,
		}).populate('user');

		if (!userVerication)
			return res.status(404).json({ message: 'Invalid or expired token' });

		const user = await User.findById(userVerication.user._id);
		if (!user) return res.status(404).json({ message: 'User not found' });

		user.isVerified = true;
		userVerication.isExpired = true;

		await userVerication.save();
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Save refresh token in the database
		user.refreshToken = refreshToken;
		await user.save();

		return res.status(201).json({
			message: 'User registered successfully',
			accessToken,
			refreshToken,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
