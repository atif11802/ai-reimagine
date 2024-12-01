const Promo = require("../../models/Promo.js");

module.exports = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const promos = await Promo.find().populate("plan").skip(skip).limit(limit); // Adjust population as needed

    const total = await Promo.countDocuments({});
    return res.status(200).json({ promos, skip, limit, total });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching promos", error: error.message });
  }
};
