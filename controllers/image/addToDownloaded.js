const mongoose = require("mongoose");
const ImageGeneration = require("../../models/ImageGeneration.js");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const axios = require("axios");

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function downloadImage(url, filepath) {
  try {
    const writer = fs.createWriteStream(filepath);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.log(error);
  }
}

async function uploadToS3(filePath, name) {
  try {
    AWS.config.update({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      signatureVersion: "v4",
    });

    const s3 = new AWS.S3();

    const fileContent = fs.readFileSync(filePath);

    const fileName = `download-generated-${Date.now()}_${name.replace(
      /[:\/\\]/g,
      "_"
    )}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: fileContent,
      Key: fileName,
    };

    return s3.upload(params).promise();
  } catch (error) {
    console.log(error);
  }
}

async function deleteFileWithRetry(filePath, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fs.promises.access(filePath); // Check if the file exists
      await fs.promises.unlink(filePath); // Attempt to delete the file
      console.log(`File deleted successfully: ${filePath}`);

      return;
    } catch (err) {
      if (err.code === "EPERM") {
        console.log(
          `Permission error, retrying to delete file: ${filePath}, attempt: ${attempt}`
        );
      } else if (err.code === "ENOENT") {
        // If file doesn't exist, no need to retry further
        console.log(`File not found: ${filePath}`);
        return;
      } else {
        console.log(
          `Failed to delete file: ${filePath}, attempt: ${attempt}, error: ${err.message}`
        );
      }

      if (attempt === retries) {
        throw new Error(
          `Failed to delete file after ${retries} attempts: ${filePath}`
        );
      }

      // Wait for a retry delay before trying again
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

module.exports = async (req, res) => {
  try {
    const {
      imageGenerationId,
      sizeName = "Standard",
      size = "768 * 512",
    } = req.body;

    if (!mongoose.isValidObjectId(imageGenerationId)) {
      return res.status(400).json({ message: "Invalid image generated Id" });
    }

    const imageGeneration = await ImageGeneration.findOne({
      _id: imageGenerationId,
      user: req?.user?._id,
      type: "Generate",
    });

    if (!imageGeneration) {
      res.status(404).json({ message: "Image Not Found" });
    }

    // process image to expected resolution

    const generatedUrl = imageGeneration.generatedUrl[0];

    const tempFilePath = path.resolve(
      __dirname,
      `${Date.now()}_${generatedUrl.replace(/[:\/\\]/g, "_")}`
    );
    const sharpOutputFile = path.resolve(
      __dirname,
      `shart-output-${Date.now()}_${generatedUrl.replace(/[:\/\\]/g, "_")}`
    );

    await downloadImage(generatedUrl, tempFilePath);

    console.log("image downloaded successfully");

    const width = parseInt(size.split(" * ")[0]);
    const height = parseInt(size.split(" * ")[1]);

    await sharp(tempFilePath).resize(width, height).toFile(sharpOutputFile);

    console.log("image resized successfully");

    const result = await uploadToS3(sharpOutputFile, generatedUrl);
    console.log("Image uploaded successfully:", result.Location);

    await deleteFileWithRetry(tempFilePath);
    await deleteFileWithRetry(sharpOutputFile);

    imageGeneration.downloaded = true;
    imageGeneration.others.downloadedAt = new Date();
    imageGeneration.others.downloadSizeName = sizeName;
    imageGeneration.others.downloadSize = size;
    imageGeneration.others.downloadedImage = result.Location;

    await imageGeneration.save();

    res
      .status(201)
      .json({ message: "Image Added to downloaded", image: result.Location });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
