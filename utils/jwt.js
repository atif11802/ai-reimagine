const jwt = require('jsonwebtoken');

// Generate Access Token
const generateAccessToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
	}); // Short-lived access token
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
	}); // Longer-lived refresh token
};

module.exports = { generateAccessToken, generateRefreshToken };
