const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const generatedImages = await ImageGeneration.find({
      user: req?.user?._id,
    })
      .skip(skip)
      .limit(limit);
    res.status(200).json({ generatedImages, skip, limit });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
