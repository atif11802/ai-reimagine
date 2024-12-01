const User = require("../../models/User.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({}, "-password -refreshToken")
      .skip(skip)
      .limit(limit); // Exclude password from the results
    return res.status(200).json({ users, skip, limit });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
