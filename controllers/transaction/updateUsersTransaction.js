const Transaction = require('../../models/Transaction.js');

module.exports = async (req, res) => {
	const userId = req.user._id;
	const transactionId = req.params.id;
	const { amount, credits, transactionId: newTransactionId, status } = req.body;

	try {
		const transaction = await Transaction.findOne({
			_id: transactionId,
			user: userId,
		});
		if (!transaction)
			return res.status(404).json({ message: 'Transaction not found' });

		// Update fields if they are provided in the request body
		if (amount !== undefined) transaction.amount = amount;
		if (credits !== undefined) transaction.credits = credits;
		if (newTransactionId !== undefined)
			transaction.transactionId = newTransactionId;
		if (
			status !== undefined &&
			['Pending', 'Completed', 'Failed'].includes(status)
		) {
			transaction.status = status;

			// Complete the transaction if status is 'Completed'
			if (status === 'Completed') {
				await transaction.completeTransaction();
			} else {
				await transaction.save();
			}
		} else {
			await transaction.save();
		}

		return res
			.status(200)
			.json({ message: 'Transaction updated successfully', data: transaction });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating transaction', error: error.message });
	}
};
