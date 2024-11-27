
const Plan = require('../../models/Plan.js');

module.exports = async (req, res) => {
	try {
		const plan = await Plan.findById(req.params.id).populate('promo');
		if (!plan) return res.status(404).json({ message: 'Plan not found' });

		return res.status(200).json(plan);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching plan', error: error.message });
	}
};