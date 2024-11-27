const Transaction = require('../../models/Transaction.js');

module.exports = async (req, res) => {
	const userId = req.user._id;
	const transactionId = req.params.id;

	try {
		const transaction = await Transaction.findOneAndDelete({
			_id: transactionId,
			user: userId,
		});
		if (!transaction)
			return res.status(404).json({ message: 'Transaction not found' });

		return res.status(200).json({ message: 'Transaction deleted successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error deleting transaction', error: error.message });
	}
};
