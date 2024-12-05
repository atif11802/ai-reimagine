const ImageGeneration = require("../../models/ImageGeneration.js");
const mongoose = require("mongoose");
const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
	try {
		const { imageGenerationId } = req.params;

		if (!mongoose.isValidObjectId(imageGenerationId)) {
			return res.status(400).json({ message: "Invalid image generated Id" });
		}

		const image = await ImageGeneration.findOne({
			_id: imageGenerationId,
			user: req?.user?._id,
			type: "Generate",
		});

		if (!image) {
			return res.status(404).json({ message: "Image Not Found" });
		}

		let project = image.project;

		if (project) {
			const pj = await Project.findById(project);

			const pjMedia = pj?.media.filter(
				(item) => String(item) !== String(imageGenerationId)
			);

			pj.media = pjMedia;
			await pj.save();

			// if (!pj.media?.length) {
			// 	const result = await Project.findByIdAndDelete(pj._id);
			// }
		}

		await ImageGeneration.findByIdAndDelete(imageGenerationId);

		res.status(200).json({ message: "Image Generation Deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
