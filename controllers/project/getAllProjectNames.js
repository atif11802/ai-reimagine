const Project = require("../../models/Project.js");

module.exports = async (req, res) => {
	try {
		const skip = parseInt(req.query.skip) || 0;
		const limit = parseInt(req.query.limit) || 10;

		let projectNames = await Project.find({
			user: req?.user?._id,
		})
			.select("-media -user")
			.sort({ updatedAt: -1 })
			.skip(skip)
			.limit(limit);

		const checkUnassigned = projectNames?.find(
			(proj) => proj.name === "Unassigned"
		);

		if (!checkUnassigned) {
			await Project.create({
				user: req?.user?._id,
				name: "Unassigned",
			});

			projectNames = await Project.find({
				user: req?.user?._id,
			})
				.select("-media -user")
				.sort({ updatedAt: -1 })
				.skip(skip)
				.limit(limit);
		}

		const total = await Project.countDocuments({
			user: req?.user?._id,
		});

		res.status(200).json({ projectNames, skip, limit, total });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
