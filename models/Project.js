const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImageGeneration",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Project", ProjectSchema);
