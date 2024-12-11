const Solution = require("../../models/Solution.js");

function containsNumbers(value) {
	return /\d/.test(value);
}

module.exports = async (req, res) => {
	try {
		const solution = await Solution.findById({
			user: req?.user?._id,
			_id: req.params.id,
		})
			.populate("generated_image")
			.lean();

		if (!solution) {
			return res.status(404).json({ message: "solution Not Found" });
		}

		const tags = [];

		// if (solution?.generated_image?.length > 0) {
		// 	Object.entries(solution?.generated_image[0]?.others).forEach(
		// 		([key, value]) => {
		// 			if (typeof value === "string" && !containsNumbers(value)) {
		// 				tags.push(value);
		// 			}
		// 		}
		// 	);
		// 	solution.tags = tags;
		// }

		if (solution?.generated_image?.length > 0) {
			for (let i = 0; i < solution?.generated_image.length; i++) {
				const element = solution?.generated_image[i];
				element.tags = [];

				Object.entries(element?.others).forEach(([key, value]) => {
					if (typeof value === "string" && !containsNumbers(value)) {
						element.tags.push(value);
					}
				});
			}
		}

		res.status(200).json({
			solution,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
