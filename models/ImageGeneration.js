const mongoose = require("mongoose");

const imageGenerationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["Mask", "Generate"],
    required: true,
  },
  prompt: { type: String, required: false }, // Description used for image generation
  imageUrl: { type: String, required: true }, // URL of the image to generate
  creditsUsed: { type: Number, required: true }, // Credits spent for this generation
  maskUrls: [{ type: mongoose.Schema.Types.Mixed }], // Store mask URLs
  generatedUrl: [{ type: mongoose.Schema.Types.Mixed }], // URL of the AI-generated image
  jobId: { type: String, unique: true }, // job ID from the AI service
  others: { type: mongoose.Schema.Types.Mixed },
  status: {
    type: String,
    enum: ["Processing", "Completed", "Failed"],
    default: "Processing",
  },
  favourite: { type: Boolean, default: false },
  downloaded: { type: Boolean, default: false },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  createdAt: { type: Date, default: Date.now },
});

imageGenerationSchema.methods.deductCredits = async function () {
  const getUserCredits = require("../utils/getUserCredits");
  const availableCredits = await getUserCredits(this.user);
  if (availableCredits >= this.creditsUsed) {
    this.status = "Completed";
    await this.save();
  } else {
    throw new Error("Insufficient credits");
  }
};

const ImageGeneration = mongoose.model(
  "ImageGeneration",
  imageGenerationSchema
);
module.exports = ImageGeneration;
