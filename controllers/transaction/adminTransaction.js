const Transaction = require("../../models/Transaction.js");

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const transactions = await Transaction.find()
      .populate("user", "_id name email")
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments();

    res.status(200).json({ transactions, skip, limit, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "user",
      "_id name email"
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update one transaction by ID
exports.updateTransactionById = async (req, res) => {
  try {
    // Extract only the fields that are allowed to be updated
    const { credits, status } = req.body;
    const updateFields = {};
    if (credits !== undefined) updateFields.credits = credits;
    if (status !== undefined) updateFields.status = status;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
