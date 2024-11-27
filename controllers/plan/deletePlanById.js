const Plan = require('../../models/Plan.js');

module.exports = async (req, res) => {
	try {
		const plan = await Plan.findByIdAndDelete(req.params.id);
		if (!plan) return res.status(404).json({ message: 'Plan not found' });

		return res.status(200).json({ message: 'Plan deleted successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting plan', error: error.message });
	}
};
