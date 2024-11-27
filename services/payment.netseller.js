const axios = require('axios');
const crypto = require('crypto');

function generateSignature(
	CompanyNum,
	TransType,
	TypeCredit,
	Amount,
	Currency,
	CardNum,
	PersonalHashKey
) {
	const concatenatedString =
		CompanyNum +
		TransType +
		TypeCredit +
		Amount +
		Currency +
		CardNum +
		PersonalHashKey;
	const sha256Hash = crypto
		.createHash('sha256')
		.update(concatenatedString)
		.digest('base64');
	const urlEncodedSignature = encodeURIComponent(sha256Hash);
	return urlEncodedSignature;
}

async function requestToNetsellerpay({
	cardNum,
	expMonth,
	expYear,
	cardName,
	amount,
	cvv2,
	email,
	mobileNo,
	planId = 'test',
}) {
	try {
		const paymentUrl = process.env.NETSELLER_PAYMENT_URL;
		const companyNum = process.env.NETSELLER_COMPANYNUM;
		const transType = process.env.NETSELLER_TRANSTYPE;
		const typeCredit = process.env.NETSELLER_TYPECREDIT;
		const currencyCode = process.env.NETSELLER_CURRENCYCODE;
		const notificationURL = process.env.NETSELLER_WEBHOOK_URL;
		const order = planId;

		const signature = generateSignature(
			companyNum,
			transType,
			typeCredit,
			amount,
			currencyCode,
			cardNum,
			process.env.NETSELLER_SIGNATURE_HASH
		);

		const params = new URLSearchParams({
			CompanyNum: companyNum,
			TransType: transType,
			CardNum: cardNum,
			ExpMonth: expMonth,
			ExpYear: expYear,
			Member: cardName,
			TypeCredit: typeCredit,
			Amount: amount,
			Currency: currencyCode,
			CVV2: cvv2,
			Email: email,
			PhoneNumber: mobileNo,
			notification_url: notificationURL,
			Order: order,
			Value: '1',
		});

		const fullURL = `${paymentUrl}?${params.toString()}`;

		const response = await axios.post(fullURL);
		// Extract necessary data from the response

		const reply = response.data.split('&').reduce((acc, item) => {
			const [key, value] = item.split('=');
			acc[key] = value;
			return acc;
		}, {});

		const responseData = {
			status: response.status,
			data: response.data,
			// Add other properties you want to include
			transactionId: reply.TransID,
			payment: reply.Reply === '000' ? 'success' : 'failed',
		};
		return responseData;
	} catch (error) {
		console.error('Error in Payment:', error);
		// You might want to handle the error here
		throw error;
	}
}

module.exports = {
	generateSignature,
	requestToNetsellerpay,
};
