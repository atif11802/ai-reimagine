const mongoose = require("mongoose");
const ImageGeneration = require("../../models/ImageGeneration.js");
const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
  try {
    const { imageGenerationId, projectId, projectName } = req.body;

    if (!mongoose.isValidObjectId(imageGenerationId)) {
      return res.status(400).json({ message: "Invalid image credentials" });
    }

    if (!projectId && !projectName) {
      return res.status(400).json({ message: "Invalid project credentials" });
    }

    const imageGenerated = await ImageGeneration.findOne({
      _id: imageGenerationId,
      type: "Generate",
      user: req?.user?._id,
    });

    if (!imageGenerated) {
      return res.status(400).json({ message: "Generation Not Found" });
    }

    if (projectId && !mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({ message: "Invalid project credentials" });
    }

    let project;

    if (projectId) {
      project = await Project.findById(projectId);

      if (!project) {
        res.status(400).json({ message: "Project Not Found" });
      }

      project.media = Array.from(
        new Set([...project.media, imageGenerated?._id])
      );
    }

    if (!project && projectName) {
      project = new Project({
        user: req?.user?._id,
        name: projectName,
        media: [imageGenerationId],
      });
    }

    await project.save();

    imageGenerated.project = project?._id;

    await imageGenerated.save();

    res.status(201).json({ message: "Added to Project" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
