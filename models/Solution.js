const mongoose = require("mongoose");

const SolutionSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		solution_name: { type: String, required: true },
		mask_category: { type: String },
		url: { type: String, required: true },
		mask_job_id: { type: String },
		generated_job_id: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "ImageGeneration" },
		],
	},

	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Solution", SolutionSchema);
