const User = require('../../models/User.js');
const getUserCredits = require('../../utils/getUserCredits.js');
module.exports = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select(
			'-password -isVerified -isAdmin -refreshToken'
		);
		if (!user) res.status(400).json({ message: 'User is not Found' });
		const availableCredit = await getUserCredits(user._id);
		return res.status(200).json({ ...user.toObject(), availableCredit });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error getting promo', error: error.message });
	}
};
