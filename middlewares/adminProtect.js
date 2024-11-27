const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const adminProtect = async (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access Denied: No Token Provided!' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id).select(
			'_id name email isAdmin isVerified'
		);
		if (!user) {
			return res
				.status(401)
				.json({ message: 'Access Denied: User Not Found!' });
		}
		if (!user.isAdmin) {
			return res.status(403).json({ message: 'Forbidden Access: Admin Only!' });
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid or Expired Token' });
	}
};

module.exports = adminProtect;
