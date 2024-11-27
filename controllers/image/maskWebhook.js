const ImageGeneration = require('../../models/ImageGeneration.js');

module.exports = async (req, res) => {
	const { job_id, job_status, masks } = req?.body?.data;

	try {
		// res.status(200);
		// return console.log(req.body.data);
		const imageGeneration = await ImageGeneration.findOne({ jobId: job_id });
		if (!imageGeneration)
			return res.status(404).json({ message: 'Job not found' });

		console.log('Mask Webhook Hitted with: ', masks);
		if (job_status === 'done') {
			imageGeneration.status = 'Completed';
			imageGeneration.maskUrls = masks;
			await imageGeneration.save();
		} else {
			imageGeneration.status = 'Failed';
			await imageGeneration.save();
		}

		res.status(200).send('Webhook received');
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
