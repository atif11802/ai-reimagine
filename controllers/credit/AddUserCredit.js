const Credit = require('../../models/Credit.js');
const mongoose = require('mongoose');

module.exports = async (req, res) => {
	try {
		const { userId, creditsEarned, transactionId, status } = req.body;

		// Validate required fields
		if (!userId || !creditsEarned) {
			return res
				.status(400)
				.json({ error: 'User ID and credits earned are required' });
		}

		// Create a new Credit document
		const newCredit = new Credit({
			user: userId,
			creditsEarned,
			transaction: transactionId,
			status: status || 'Completed',
		});

		// Save the Credit document to the database
		const savedCredit = await newCredit.save();

		// Respond with the saved Credit document
		return res.status(201).json(savedCredit);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
