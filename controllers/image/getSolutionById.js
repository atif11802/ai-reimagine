const Solution = require("../../models/Solution.js");

module.exports = async (req, res) => {
  try {
    const solution = await Solution.findById({
      user: req?.user?._id,
      _id: req.params.id,
    });

    if (!solution) {
      return res.status(404).json({ message: "solution Not Found" });
    }

    const responseSolution = {
      solutionName: solution.solution_name,
      url: solution.url,
      _id: solution._id,
      createdAt: solution.createdAt,
      updatedAt: solution.updatedAt,
      __v: solution.__v,
    };

    res.status(200).json({ solution: responseSolution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
