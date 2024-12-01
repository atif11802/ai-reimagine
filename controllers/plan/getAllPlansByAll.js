const Plan = require("../../models/Plan.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const plans = await Plan.find().populate("promo").skip(skip).limit(limit); // Adjust population as needed
    return res.status(200).json({ plans, skip, limit });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching plans", error: error.message });
  }
};
