const Plan = require('../../models/Plan.js');
const Promo = require('../../models/Promo.js');
const Transaction = require('../../models/Transaction.js');
const netseller = require('../../services/payment.netseller.js');

module.exports = async (req, res) => {
	const {
		cardNum,
		expMonth,
		expYear,
		cardName,
		cvv2,
		email,
		mobileNo,
		planId,
		promo,
		quantity = 1,
	} = req.body;

	const userId = req.user._id; // Get the user ID from req.user

	try {
		const plan = await Plan.findById(planId).populate('promo');
		const userPromo = promo
			? await Promo.findOne({ code: promo }).populate('plan')
			: false;

		if (!plan) return res.status(400).json({ message: 'Invalid Plan' });

		if (promo && !userPromo)
			return res.status(400).json({ message: 'Invalid Promo' });

		if (
			promo &&
			userPromo &&
			plan.promo &&
			!userPromo.plan._id.equals(plan._id)
		) {
			return res.status(400).json({ message: 'Invalid Promo' });
		}

		if (promo && userPromo && userPromo.expiresAt) {
			const now = new Date();
			const expiresAt = new Date(userPromo.expiresAt);
			if (expiresAt < now) {
				return res.status(400).json({ message: 'Promo Expired' });
			}
		}

		let amount = plan.price;
		let credits = plan.credit;

		if (promo && userPromo) {
			const discount = (plan.price * userPromo.deduct) / 100;
			const discountedAmount = plan.price - discount;
			amount = discountedAmount > 0 ? discountedAmount : 0;
		}

		//custom plan logic
		if (plan.isCustom) {
			amount = amount * Math.round(Number(quantity));
			credits = credits * Math.round(Number(quantity));
		}

		const transactionDetails = {
			cardNum,
			expMonth,
			expYear,
			cardName,
			amount,
			cvv2,
			email,
			mobileNo,
			planId: plan._id,
		};

		const transaction = new Transaction({
			user: userId,
			amount,
			credits,
			transactionId: 'temp',
			status: 'Pending',
		});

		const tempTransaction = await transaction.save();

		let paymentReturn;

		try {
			paymentReturn = await netseller.requestToNetsellerpay(transactionDetails);
		} catch (err) {
			tempTransaction.status = 'Failed';
			tempTransaction.transactionId = 'failed';
			await tempTransaction.save();
			console.log(err);
			return res.status(500).json({ message: 'Payment Request Failed' });
		}

		if (paymentReturn.payment === 'failed' || paymentReturn.status >= 400) {
			tempTransaction.status = 'Failed';
			tempTransaction.transactionId = 'failed';
			await tempTransaction.save();
			return res.status(400).json({ message: 'Payment Failed' });
		}

		//set transaction id to tempTransaction and save
		tempTransaction.transactionId = paymentReturn.transactionId;

		await tempTransaction.save();

		//after payment gateway procedures done
		await tempTransaction.completeTransaction();

		return res.status(201).json({
			message: 'Transaction created successfully',
			transaction: tempTransaction,
		});
	} catch (error) {
		console.log(error.stack);
		return res
			.status(500)
			.json({ message: 'Error creating transaction', error: error.message });
	}
};
