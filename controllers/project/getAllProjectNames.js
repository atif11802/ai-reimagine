const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
  try {
    const projectNames = await Project.find({
      user: req?.user?._id,
    })
      .select("-media -user")
      .sort({ updatedAt: -1 });

    res.status(200).json(projectNames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
