const sharp = require('sharp');

// Helper function to resize image if resolution exceeds 2048x2048
module.exports = async function resizeImageIfNeeded(filePath, outputFilePath) {
	const image = sharp(filePath);
	const metadata = await image.metadata();

	if (metadata.width > 2048 || metadata.height > 2048) {
		await image
			.resize(2048, 2048, {
				fit: sharp.fit.inside,
				withoutEnlargement: true,
			})
			.toFile(outputFilePath);
		return outputFilePath;
	}
	return filePath; // If no resizing is needed, return original file path
};
