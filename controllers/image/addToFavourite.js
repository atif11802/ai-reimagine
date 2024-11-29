const mongoose = require("mongoose");
const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  try {
    const { imageGenerationId } = req.body;

    if (!mongoose.isValidObjectId(imageGenerationId)) {
      return res.status(400).json({ message: "Invalid image generated Id" });
    }

    const favouriteImage = await ImageGeneration.findOne({
      _id: imageGenerationId,
      user: req?.user?._id,
      type: "Generate",
    });

    if (!favouriteImage) {
      res.status(404).json({ message: "Image Not Found" });
    }

    favouriteImage.favourite = true;
    await favouriteImage.save();

    res.status(201).json({ message: "Image Added to Favourite" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
