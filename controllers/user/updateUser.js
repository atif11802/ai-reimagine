const User = require('../../models/User.js');

module.exports = async (req, res) => {
	const { name, email, password, isAdmin, isVerified } = req.body;

	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Ensure that the user can only update themselves, or an admin can update any user
		if (req.user._id !== user._id.toString() && !req.user.isAdmin) {
			return res
				.status(403)
				.json({ message: 'Forbidden: You can only update your own account' });
		}

		// Update fields if provided
		if (name) user.name = name;
		if (email) user.email = email;
		if (password) user.password = password; // Will be hashed by the pre-save middleware
		if (typeof isAdmin !== 'undefined' && req.user.isAdmin)
			user.isAdmin = isAdmin;
		if (typeof isVerified !== 'undefined' && req.user.isAdmin)
			user.isVerified = isVerified;

		await user.save();
		return res.status(200).json({
			message: 'User updated successfully',
			user: {
				name: user.name,
				email: user.email,
				_id: user._id,
				isAdmin: user.isAdmin,
				isVerified: user.isVerified,
			},
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating user', error: error.message });
	}
};
