const ImageGeneration = require("../../models/ImageGeneration.js");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
  try {
    const { imageGenerationId } = req.body;

    if (!mongoose.isValidObjectId(imageGenerationId)) {
      return res.status(400).json({ message: "Invalid image generated Id" });
    }

    const favoriteImage = await ImageGeneration.findOne({
      _id: imageGenerationId,
      user: req?.user?._id,
      type: "Generate",
    });

    if (!favoriteImage) {
      res.status(404).json({ message: "Image Not Found" });
    }

    favoriteImage.favourite = !favoriteImage.favourite;
    await favoriteImage.save();

    res.status(201).json({
      message: "updated favourite value of image",
      image: favoriteImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
