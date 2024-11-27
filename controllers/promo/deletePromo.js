const Promo = require('../../models/Promo.js');

module.exports = async (req, res) => {
	try {
		const promo = await Promo.findByIdAndDelete(req.params.id);
		if (!promo) return res.status(404).json({ message: 'Promo not found' });

		return res.status(200).json({ message: 'Promo deleted successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting promo', error: error.message });
	}
};
