const Promo = require('../../models/Promo.js');

module.exports = async (req, res) => {
	try {
		const promos = await Promo.find().populate('plan'); // Adjust population as needed
		return res.status(200).json(promos);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching promos', error: error.message });
	}
};
