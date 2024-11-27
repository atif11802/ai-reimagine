const Plan = require('../../models/Plan.js');

module.exports = async (req, res) => {
	try {
		const plans = await Plan.find().populate('promo'); // Adjust population as needed
		return res.status(200).json(plans);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching plans', error: error.message });
	}
};
