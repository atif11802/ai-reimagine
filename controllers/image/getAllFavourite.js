const ImageGeneration = require("../../models/ImageGeneration.js");
module.exports = async (req, res) => {
	try {
		const skip = parseInt(req.query.skip) || 0;
		const limit = parseInt(req.query.limit) || 10;

		const data = await ImageGeneration.find({
			user: req?.user?._id,
			type: "Generate",
			favourite: true,
		})
			.skip(skip)
			.limit(limit);
		const total = await ImageGeneration.countDocuments({
			user: req?.user?._id,
			type: "Generate",
			favourite: true,
		});
		res.status(200).json({ data, skip, limit, total });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
};
