const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  const { jobId } = req.params;
  try {
    const image = await ImageGeneration.findOne({
      jobId,
      user: req?.user?._id,
    })
      .select("-creditsUsed")
      .populate("user", "-refreshToken -password -isAdmin -isVerified")
      .populate("solutionId");
    if (!image) return res.status(400).json({ message: "Image Not Found" });
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
