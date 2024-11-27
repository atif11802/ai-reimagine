const Transaction = require('../../models/Transaction.js');

module.exports = async (req, res) => {
	const userId = req.user._id;
	const transactionId = req.params.id;

	try {
		const transaction = await Transaction.findOne({
			_id: transactionId,
			user: userId,
		}).populate('user', 'name email');
		if (!transaction)
			return res.status(404).json({ message: 'Transaction not found' });

		return res.status(200).json(transaction);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching transaction', error: error.message });
	}
};
