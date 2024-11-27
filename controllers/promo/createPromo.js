const Promo = require('../../models/Promo.js');
module.exports = async (req, res) => {
	const { name, code, description, expiresAt, maximumUse, plan, deduct } = req.body;

	try {
		const promo = new Promo({
			name,
			code,
			description,
			expiresAt,
			maximumUse,
			plan,
			deduct,
		});

		await promo.save();
		return res.status(201).json({ message: 'Promo created successfully', promo });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error creating promo', error: error.message });
	}
};
