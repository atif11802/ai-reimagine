const mongoose = require("mongoose");
const Project = require("../../models/Project.js");
const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  try {
    const projects = await Project.find({
      user: req?.user?._id,
    })
      .populate("media")
      .sort({
        updatedAt: 1,
      });

    const unassignedImages = await ImageGeneration.find({
      user: req?.user?._id,
      type: "Generate",
      status: "Completed",
      project: null,
    }).sort({
      _id: 1,
    });

    const unassinedProject = {
      user: req?.user?._id,
      name: "Unassigned",
      media: unassignedImages,
    };

    if (unassignedImages.length) projects.push(unassinedProject);

    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
