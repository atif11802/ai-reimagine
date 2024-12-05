const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // Amount paid
  credits: { type: Number, required: true }, // Credits received for this transaction
  transactionId: { type: String, required: true }, // Payment gateway transaction ID
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

transactionSchema.methods.completeTransaction = async function () {
  this.status = "Completed";
  await this.save();

  const Credit = require("../models/Credit");

  // Create a corresponding credit entry
  await Credit.create({
    user: this.user,
    creditsEarned: this.credits,
    transaction: this._id,
    status: "Completed",
  });
};

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
