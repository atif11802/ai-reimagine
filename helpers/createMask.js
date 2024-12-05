const ImageGeneration = require("../models/ImageGeneration");
const Solution = require("../models/Solution");
const callReimagine = require("../utils/callReimagine");
const getUserCredits = require("../utils/getUserCredits");

module.exports = {
	createMask: async (solutionId, user) => {
		try {
			const solution = await Solution.findOne({
				_id: solutionId,
				user,
			});

			if (!solution) {
				throw new Error("Solution Not Found");
			}

			const imageUrl = solution.url;

			if (!imageUrl) {
				throw new Error("Image Not Found");
			}

			const data = {
				image_url: imageUrl,
				webhook_url: `${process.env.BACKEND_URL}/api/image/webhook/mask`,
			};

			const userCredits = await getUserCredits(user);

			if (
				userCredits === 0 ||
				userCredits < process.env.CREDITS_CONSUME_PER_REQUEST
			) {
				throw new Error("Insufficient Credit");
			}

			const maskResponse = await callReimagine("/create_mask", "POST", data);

			const newJob = new ImageGeneration({
				user: user,
				imageUrl: imageUrl,
				jobId: maskResponse?.data?.job_id,
				type: "Mask",
				solutionId: solutionId,
				creditsUsed: 0,
				//   Number(maskResponse?.data?.credits_consumed || 0) +
				//   Number(process.env.CREDITS_CONSUME_PER_REQUEST), // no credit on creating mask
				status: "Processing",
			});
			await newJob.save();

			return newJob;
		} catch (error) {
			console.log(error);
		}
	},
};
