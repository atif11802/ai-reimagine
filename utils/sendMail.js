const transporter = require('../config/smtp.transporter.js');

async function sendMail(to, subject, text, html) {
	const mailOptions = {
		from: process.env.SMTP_USER,
		to: to,
		subject: subject,
		text: text,
		html: html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		return info.response;
	} catch (error) {
		console.error('sending mail failed', error);
	}
}

module.exports = sendMail;
