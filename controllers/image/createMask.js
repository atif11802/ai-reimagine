const ImageGeneration = require("../../models/ImageGeneration.js");
const Solution = require("../../models/Solution.js");
const callReimagine = require("../../utils/callReimagine.js");
const getUserCredits = require("../../utils/getUserCredits.js");

module.exports = async (req, res) => {
  const { solutionId } = req.body;

  try {
    const solution = await Solution.findOne({
      _id: solutionId,
      user: req.user._id,
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution Not Found" });
    }

    const imageUrl = solution.url;

    if (!imageUrl) {
      return res.status(404).json({ message: "Image Not Found" });
    }

    const data = {
      image_url: imageUrl,
      webhook_url: `${process.env.BACKEND_URL}/api/image/webhook/mask`,
    };

    const userCredits = await getUserCredits(req.user._id);

    if (
      userCredits === 0 ||
      userCredits < process.env.CREDITS_CONSUME_PER_REQUEST
    ) {
      return res.status(403).json({ message: "Insufficient Credit" });
    }

    const maskResponse = await callReimagine("/create_mask", "POST", data);

    console.log("response: ", maskResponse);

    const newJob = new ImageGeneration({
      user: req.user._id, // Assuming the user ID is provided in req.user
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
    return res.status(201).json({
      message: "Mask creation started",
      jobId: maskResponse?.data?.job_id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
