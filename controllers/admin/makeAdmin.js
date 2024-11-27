const User = require('../../models/User.js');

module.exports = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });

		if (user.isAdmin) {
			return res.status(400).json({ message: 'User is already an admin' });
		}

		user.isAdmin = true;
		await user.save();
		return res.status(200).json({
			message: 'User promoted to admin',
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,
				isVerified: user.isVerified,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Error promoting user to admin',
			error: error.message,
		});
	}
};
