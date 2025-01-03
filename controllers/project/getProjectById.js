const mongoose = require("mongoose");
const Project = require("../../models/Project.js");
const Solution = require("../../models/Solution.js");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const project = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
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
          media: {
            $map: {
              input: "$media",
              as: "m",
              in: {
                $mergeObjects: [
                  "$$m",
                  {
                    media_name: {
                      $arrayElemAt: [
                        { $split: ["$$m.others.spaceTypeName", "/"] },
                        0,
                      ],
                    },
                    image_count: {
                      $size: "$$m.generatedUrl",
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (project.length === 0)
      return res.status(404).json({ message: "Project not found" });

    const media = await Promise.all(
      project[0].media.map(async (media) => {
        const solutionId = media.solutionId;

        const solution = await Solution.findById(solutionId);

        const solution_media_count = solution?.generated_image?.length ?? 0;

        return {
          ...media,
          solution_media_count,
        };
      })
    );

    project[0].media = media;

    return res.json(project[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
