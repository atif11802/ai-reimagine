const User = require('../../models/User.js');

module.exports = async (req, res) => {
	try {
		const user = await User.findById(req.params.id, '-password -refreshToken');
		if (!user) return res.status(404).json({ message: 'User not found' });

		const { refreshToken, ...filtered } = user.toObject();
		return res.status(200).json({ ...filtered });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching user', error: error.message });
	}
};
