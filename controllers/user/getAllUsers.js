const User = require('../../models/User.js');

module.exports = async (req, res) => {
	try {
		const users = await User.find({}, '-password -refreshToken'); // Exclude password from the results
		return res.status(200).json(users);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching users', error: error.message });
	}
};
