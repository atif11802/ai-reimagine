const Promo = require('../../models/Promo.js');

module.exports = async (req, res) => {
	try {
		const promo = await Promo.findById(req.params.id).populate('plan');
		if (!promo) return res.status(404).json({ message: 'Promo not found' });

		return res.status(200).json(promo);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching promo', error: error.message });
	}
};
