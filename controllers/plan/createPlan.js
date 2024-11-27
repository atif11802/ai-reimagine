const Plan = require('../../models/Plan.js');

module.exports = async (req, res) => {
	const {
		name,
		title,
		discountText,
		price,
		displayPrice,
		currency,
		currencySymbol,
		duration,
		credit,
		// creditDuration,
		isPopular,
		description,
		promo,
		isActive,
		isCustom,
	} = req.body;

	try {
		const plan = new Plan({
			name,
			title,
			discountText,
			price,
			displayPrice,
			currency,
			currencySymbol,
			duration,
			credit,
			// creditDuration,
			isPopular,
			description,
			promo,
			isActive,
			isCustom,
		});

		await plan.save();
		return res.status(201).json({ message: 'Plan created successfully', plan });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error creating plan', error: error.message });
	}
};
