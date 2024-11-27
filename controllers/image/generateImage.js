const ImageGeneration = require('../../models/ImageGeneration.js');
const callReimagine = require('../../utils/callReimagine.js');
const getUserCredits = require('../../utils/getUserCredits.js');

module.exports = async (req, res) => {
	const {
		imageUrl,
		maskJobId,
		masks,
		maskCategory,
		spaceType,
		designTheme,
		colorPreference,
		materialPreference,
		landscapingPreference,
		generationCount = 1,
		additionalPrompt,
	} = req.body;

	try {
		let mask;
		let gettedMask;

		if (maskJobId) {
			mask = await ImageGeneration.findOne({ jobId: maskJobId });
			gettedMask = mask?.maskUrls
				// .filter((item) => item.category.includes(maskCategory))
				.map((item) => item.url);
		}
		console.log(mask);
		const userCredits = await getUserCredits(req.user._id);

		if (
			userCredits === 0 ||
			userCredits < process.env.CREDITS_CONSUME_PER_REQUEST
		) {
			return res.status(403).json({ message: 'Insufficient Credit' });
		}

		const data = {
			image_url: imageUrl,
			mask_urls: mask?.maskUrls ? gettedMask : masks,
			mask_category: maskCategory,
			space_type: spaceType,
			design_theme: designTheme,
			color_preference: colorPreference,
			material_preference: materialPreference,
			landscaping_preference: landscapingPreference,
			generation_count: generationCount,
			additional_prompt: additionalPrompt,
			webhook_url: `${process.env.BACKEND_URL}/api/image/webhook/generate`,
		};
		console.log('data: ', data);

		const generateResponse = await callReimagine(
			'/generate_image',
			'POST',
			data
		);

		const newJob = new ImageGeneration({
			user: req.user._id,
			imageUrl: imageUrl,
			type: 'Generate',
			jobId: generateResponse?.data?.job_id,
			prompt: additionalPrompt,
			others: {
				maskCategory,
				maskJobId,
				spaceType,
				designTheme,
				colorPreference,
				materialPreference,
				landscapingPreference,
				generationCount,
			},
			// credit logic
			creditsUsed:
				Number(generateResponse?.data?.credits_consumed || 0) +
				Number(process.env.CREDITS_CONSUME_PER_REQUEST) * generationCount,
			status: 'Processing',
		});

		await newJob.save();
		res.status(201).json({
			message: 'Image generation started',
			jobId: generateResponse?.data?.job_id,
		});
	} catch (error) {
		if (error?.name === 'AxiosError')
			return res.status(400).json({ message: error.message });
		res.status(500).json({ message: error.message });
	}
};
