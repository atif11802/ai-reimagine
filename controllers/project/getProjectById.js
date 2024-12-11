const mongoose = require("mongoose");
const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const project = await Project.findOne({
      user: req?.user?._id,
      _id: id,
    }).populate("media");

    const pj = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req?.user?._id),
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "imagegenerations",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $addFields: {
          media_count: { $size: "$media" },
        },
      },
    ]);

    res.status(200).json({ pj });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
