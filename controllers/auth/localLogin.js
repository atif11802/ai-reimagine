const passport = require('passport');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../../utils/jwt.js');

module.exports = (req, res, next) => {
	// Check if credentials are provided
	if (!req.body.email || !req.body.password) {
		return res.status(400).json({ message: 'Missing credentials' });
	}

	passport.authenticate('local', async (err, user, info) => {
		if (err) return res.status(500).json({ message: err });
		console.log(info);
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		if (!user.isVerified)
			return res.status(401).json({ message: 'Please verify your email' });

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Save refresh token in the database
		user.refreshToken = refreshToken;
		await user.save();

		return res.json({
			accessToken,
			refreshToken,
		});
	})(req, res, next);
};

