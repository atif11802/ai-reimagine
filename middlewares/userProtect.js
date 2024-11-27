const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const userProtect = async (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access Denied: No Token Provided!' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select(
			'_id name email isVerified'
		);
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Access Denied: User Not Found!' });
		}
		if (!user.isVerified) {
			return res
				.status(401)
				.json({ message: 'Access Denied: User Not Verified!' });
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid Token' });
	}
};

module.exports = userProtect;
