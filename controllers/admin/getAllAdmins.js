const User = require("../../models/User.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const admins = await User.find({ isAdmin: true }, "-password")
      .skip(skip)
      .limit(limit); // Exclude passwords from the response
    return res.status(200).json({ admins, skip, limit });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};
