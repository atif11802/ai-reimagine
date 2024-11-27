const Promo = require('../../models/Promo.js');

module.exports = async (req, res) => {
	const { name, code, description, expiresAt, maximumUse, plan, deduct } = req.body;

	try {
		const promo = await Promo.findById(req.params.id);
		if (!promo) return res.status(404).json({ message: 'Promo not found' });

		// Update fields if they are provided in the request body
		if (name !== undefined) promo.name = name;
		if (code !== undefined) promo.code = code;
		if (description !== undefined) promo.description = description;
		if (expiresAt !== undefined) promo.expiresAt = expiresAt;
		if (maximumUse !== undefined) promo.maximumUse = maximumUse;
		if (plan !== undefined) promo.plan = plan;
		if (deduct !== undefined) promo.deduct = deduct;

		await promo.save();
		return res.status(200).json({ message: 'Promo updated successfully', promo });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating promo', error: error.message });
	}
};
