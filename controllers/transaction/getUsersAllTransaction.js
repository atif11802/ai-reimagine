const Transaction = require("../../models/Transaction.js");

module.exports = async (req, res) => {
	const userId = req.user._id;
	console.log(userId);
	try {
		const transactions = await Transaction.find({ user: userId }).populate(
			"user",
			"name email"
		);
		return res.status(200).json(transactions);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error fetching transactions", error: error.message });
	}
};
