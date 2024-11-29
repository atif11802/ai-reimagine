const sharp = require("sharp");

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
  } else if (metadata.width < 512 || metadata.height < 512) {
    const width = metadata.width < 512 ? 512 : metadata.width;
    const height = metadata.height < 512 ? 512 : metadata.height;

    await image
      .resize(width, height, {
        fit: sharp.fit.outside,
        withoutReduction: true,
      })
      .toFile(outputFilePath);
    return outputFilePath;
  }
  return filePath; // If no resizing is needed, return original file path
};
