const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  try {
    const favouriteImages = await ImageGeneration.find({
      user: req?.user?._id,
      type: "Generate",
      favourite: true,
    });
    res.status(200).json(favouriteImages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
