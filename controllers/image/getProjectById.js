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

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
