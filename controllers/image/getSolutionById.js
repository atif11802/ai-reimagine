const Solution = require("../../models/Solution.js");

function containsNumbers(value) {
  return /\d/.test(value);
}

module.exports = async (req, res) => {
  try {
    const solution = await Solution.findById({
      user: req?.user?._id,
      _id: req.params.id,
    })
      .populate("generated_image")
      .lean();

    if (!solution) {
      return res.status(404).json({ message: "solution Not Found" });
    }

    const tags = [];

    Object.entries(solution.generated_image[0].others).forEach(
      ([key, value]) => {
        if (typeof value === "string" && !containsNumbers(value)) {
          tags.push(value);
        }
      }
    );

    solution.tags = tags;

    res.status(200).json({
      solution,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
