const mongoose = require("mongoose");
const ImageGeneration = require("../../models/ImageGeneration.js");
const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
	try {
		// if already in one project remove from that
		const { imageGenerationId, projectId, projectName } = req.body;

		if (!mongoose.isValidObjectId(imageGenerationId)) {
			return res.status(400).json({ message: "Invalid image credentials" });
		}

		if (!projectId && !projectName) {
			return res.status(400).json({ message: "Invalid project credentials" });
		}

		const imageGenerated = await ImageGeneration.findOne({
			_id: imageGenerationId,
			type: "Generate",
			user: req?.user?._id,
		});

		if (!imageGenerated) {
			return res.status(400).json({ message: "Generation Not Found" });
		}

		if (projectId && !mongoose.isValidObjectId(projectId)) {
			return res.status(400).json({ message: "Invalid project credentials" });
		}

		let project;

		if (projectId) {
			project = await Project.findById(projectId);

			if (!project) {
				return res.status(400).json({ message: "Project Not Found" });
			}

			const isDuplicate = project.media.some(
				(id) => id.toString() === imageGenerated._id.toString()
			);

			if (!isDuplicate) {
				project.media.push(imageGenerated?._id);
			}
		}

		if (!project && projectName) {
			// find project of same user with same name. if exist, increment 1
			project = await Project.findOne({
				user: req?.user?._id,
				name: projectName,
			});

			let newProjectName = projectName;

			if (project) {
				newProjectName = `${projectName} ${project?.media?.length + 1}`;
			}

			project = new Project({
				user: req?.user?._id,
				name: newProjectName,
				media: [imageGenerationId],
			});
		}

		await project.save();

		// remove from previous project
		const previousProjectId = imageGenerated.project;

		if (previousProjectId) {
			const previousProject = await Project.findById(previousProjectId);
			previousProject.media = previousProject.media.filter(
				(id) => id.toString() !== imageGenerated._id.toString()
			);
			await previousProject.save();

			if (previousProject.media.length === 0) {
				await Project.findByIdAndDelete(previousProjectId);
			}
		}

		imageGenerated.project = project?._id;

		await imageGenerated.save();

		return res.status(201).json({ message: "Added to project", project });
	} catch (error) {
		console.log(error.code);
		if (error.code === 11000) {
			return res.status(400).json({ message: "Project name already exists" });
		}
		res.status(500).json({ message: "Internal Server Error" });
	}
};
