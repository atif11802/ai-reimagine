const mongoose = require("mongoose");

const SolutionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    solution_name: { type: String, required: true },
    mask_category: { type: String },
    url: { type: String, required: true },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Solution", SolutionSchema);
