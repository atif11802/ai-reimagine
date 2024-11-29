const User = require("../../models/User.js");
const AWS = require("aws-sdk");
const fs = require("fs");

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

const updateProfilePic = async (req, res) => {
  try {
    AWS.config.update({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      signatureVersion: "v4",
    });

    const s3 = new AWS.S3();
    if (!req.file) {
      throw new Error("Please upload a file");
    }

    const fileName = `${Date.now()}_${req.file.originalname.replace(" ", "_")}`;
    const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: fileContent,
      Key: fileName,
    };

    // Upload file to S3
    const uploadResult = await s3.upload(params).promise();

    // Update user profile in database
    let user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profile_pic: uploadResult.Location,
      },
      {
        new: true,
      }
    );

    user = user.toObject();
    delete user.refreshToken;
    delete user.password;

    // Return response
    res.status(200).json({
      message: "User Profile Pic Updated Successfully",
      user: {
        ...user,
      },
    });

    await deleteFileWithRetry(req.file.path);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

module.exports = updateProfilePic;
