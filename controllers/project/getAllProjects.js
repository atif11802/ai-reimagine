const Project = require("../../models/Project.js");
const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const projects = await Project.find({
      user: req?.user?._id,
    })
      .populate("media")
      .sort({
        updatedAt: -1,
      })
      .lean();

    let total = await Project.countDocuments({
      user: req?.user?._id,
    });

    const unassignedImages = await ImageGeneration.find({
      user: req?.user?._id,
      type: "Generate",
      status: "Completed",
      project: null,
    }).sort({
      _id: -1,
    });

    const unassignedProject = {
      user: req?.user?._id,
      name: "Unassigned",
      media: unassignedImages,
      createdAt: unassignedImages[0]?.createdAt,
      updatedAt: unassignedImages[0]?.createdAt,
    };

    // if (unassignedImages.length) {
    //   projects.unshift(unassignedProject);
    //   total = total + 1;
    // }

    const data = projects.slice(skip, limit);

    const result = data.map((proj) => {
      return {
        ...proj,
        media_count: proj?.media?.length,
      };
    });

    res.status(200).json({ projects: result, skip, limit, total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
