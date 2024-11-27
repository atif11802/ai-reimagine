const User = require('../../models/User.js');

module.exports = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });

		// Ensure that the user can only delete themselves, or an admin can delete any user
		if (req.user._id !== user._id.toString() && !req.user.isAdmin) {
			return res
				.status(403)
				.json({ message: 'Forbidden: You can only delete your own account' });
		}

		await User.deleteOne({ _id: req.params.id });
		return res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting user', error: error.message });
	}
};
