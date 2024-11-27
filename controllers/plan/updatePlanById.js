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
		isCustom
	} = req.body;

	try {
		const plan = await Plan.findById(req.params.id);
		if (!plan) return res.status(404).json({ message: 'Plan not found' });

		// Update fields if they are provided in the request body
		if (name !== undefined) plan.name = name;
		if (title !== undefined) plan.title = title;
		if (discountText !== undefined) plan.discountText = discountText;
		if (price !== undefined) plan.price = price;
		if (displayPrice !== undefined) plan.displayPrice = displayPrice;
		if (currency !== undefined) plan.currency = currency;
		if (currencySymbol !== undefined) plan.currencySymbol = currencySymbol;
		if (duration !== undefined) plan.duration = duration;
		if (credit !== undefined) plan.credit = credit;
		// if (creditDuration !== undefined) plan.creditDuration = creditDuration;
		if (isPopular !== undefined) plan.isPopular = isPopular;
		if (description !== undefined) plan.description = description;
		if (promo !== undefined) plan.promo = promo;
		if (isActive !== undefined) plan.isActive = isActive;
		if (isCustom !== undefined) plan.isCustom = isCustom;

		await plan.save();
		return res.status(200).json({ message: 'Plan updated successfully', plan });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating plan', error: error.message });
	}
};
