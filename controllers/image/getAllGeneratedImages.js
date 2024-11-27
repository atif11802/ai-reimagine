const ImageGeneration = require('../../models/ImageGeneration.js');

module.exports = async (req, res) => {
	try {
		const generatedImages = await ImageGeneration.find({
			user: req?.user?._id,
		});
		res.status(200).json(generatedImages);
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
};
