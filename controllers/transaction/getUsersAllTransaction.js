const Transaction = require("../../models/Transaction.js");

module.exports = async (req, res) => {
  const userId = req.user._id;

  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;

  console.log(userId);
  try {
    const transactions = await Transaction.find({ user: userId })
      .populate("user", "name email")
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ transactions, skip, limit });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};
