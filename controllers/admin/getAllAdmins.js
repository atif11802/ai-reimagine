const User = require('../../models/User.js');

module.exports = async (req, res) => {
	try {
		const admins = await User.find({ isAdmin: true }, '-password'); // Exclude passwords from the response
		return res.status(200).json(admins);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching admins', error: error.message });
	}
};
