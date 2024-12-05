const fs = require("fs");
const AWS = require("aws-sdk");
const express = require("express");
const multer = require("multer");
const File = require("../models/File.js");
const router = express.Router();
const uploadFile = multer({ dest: "from/" });
const userProtect = require("../middlewares/userProtect.js");
const resizeImageIfNeeded = require("../utils/resizeImage.js");
const User = require("../models/User.js");
const Solution = require("../models/Solution.js");

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

// uploads a single file to s3
router.post("/", userProtect, uploadFile.single("image"), async (req, res) => {
  // configuring the AWS environment
  AWS.config.update({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
  });

  const s3 = new AWS.S3();
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${Date.now()}_${req.file.originalname.replace(" ", "_")}`;
    const resizedFilePath = `from/resized_${fileName}`; // Temporary file path for resized image

    console.log(`Original file path: ${req.file.path}`);
    console.log(`Resized file path: ${resizedFilePath}`);

    // Resize the image if needed
    const finalFilePath = await resizeImageIfNeeded(
      req.file.path,
      resizedFilePath
    );

    const fileContent = fs.readFileSync(finalFilePath);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Body: fileContent,
      Key: fileName,
    };

    s3.upload(params, async function (err, data) {
      // handle error
      if (err) {
        console.log("there was an error");
        console.log("Error", err);

        return res.status(500).json({ message: "Uploading File Failed" });
      }

      // success
      if (data) {
        console.log(data);
        console.log("Uploaded in:", data.Location);
        // Save the file URL to the database
        try {
          const file = new File({
            user: req.user._id,
            url: data.Location,
          });
          await file.save();
          console.log("File saved to database:", file);
        } catch (dbError) {
          console.log("Database error:", dbError);
          return res.status(500).json({ message: "Saving File URL Failed" });
        }

        try {
          console.log(
            "file paths \n",
            "file: ",
            req.file.path,
            "\n",
            "resized file: ",
            resizedFilePath
          );

          await deleteFileWithRetry(resizedFilePath); // Remove the resized file if it was created
          await deleteFileWithRetry(req.file.path);
        } catch (deleteError) {
          console.log("Error deleting file:", deleteError);
        }

        return res.status(200).json({ url: data.Location });
      }
    });
  } catch (e) {
    try {
      await deleteFileWithRetry(req.file.path);
      await deleteFileWithRetry(resizedFilePath);
    } catch (deleteError) {
      console.log("Error deleting file:", deleteError);
    }
    console.log(e.message);
    res.status(500).json({ message: "error" });
  }
});

// uploads a single file to s3
router.post(
  "/solution",
  userProtect,
  uploadFile.single("image"),
  async (req, res) => {
    // configuring the AWS environment
    const { solutionName, maskCategory } = req.body;

    AWS.config.update({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      signatureVersion: "v4",
    });

    const s3 = new AWS.S3();
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = `${Date.now()}_${req.file.originalname.replace(
        " ",
        "_"
      )}`;
      const resizedFilePath = `from/resized_${fileName}`; // Temporary file path for resized image

      console.log(`Original file path: ${req.file.path}`);
      console.log(`Resized file path: ${resizedFilePath}`);

      // Resize the image if needed
      const finalFilePath = await resizeImageIfNeeded(
        req.file.path,
        resizedFilePath
      );

      const fileContent = fs.readFileSync(finalFilePath);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: fileContent,
        Key: fileName,
      };

      s3.upload(params, async function (err, data) {
        // handle error
        if (err) {
          console.log("there was an error");
          console.log("Error", err);

          return res.status(500).json({ message: "Uploading File Failed" });
        }

        // success
        if (data) {
          console.log(data);
          console.log("Uploaded in:", data.Location);
          // Save the file URL to the database
          try {
            const solution = new Solution({
              user: req.user._id,
              url: data.Location,
              solution_name: solutionName,
              mask_category: maskCategory,
            });
            await solution.save();

            console.log("File saved to database:", solution);

            const responseSolution = {
              solutionName: solution.solution_name,
              maskCategory: solution.mask_category,
              url: solution.url,
              _id: solution._id,
              createdAt: solution.createdAt,
              updatedAt: solution.updatedAt,
              __v: solution.__v,
            };

            res.status(200).json({ solution: responseSolution });
          } catch (dbError) {
            console.log("Database error:", dbError);
            return res.status(500).json({ message: "Saving File URL Failed" });
          }

          try {
            console.log(
              "file paths \n",
              "file: ",
              req.file.path,
              "\n",
              "resized file: ",
              resizedFilePath
            );

            await deleteFileWithRetry(resizedFilePath); // Remove the resized file if it was created
            await deleteFileWithRetry(req.file.path);
          } catch (deleteError) {
            console.log("Error deleting file:", deleteError);
          }
        }
      });
    } catch (e) {
      try {
        await deleteFileWithRetry(req.file.path);
        await deleteFileWithRetry(resizedFilePath);
      } catch (deleteError) {
        console.log("Error deleting file:", deleteError);
      }
      console.log(e.message);
      res.status(500).json({ message: "error" });
    }
  }
);

// uploads multiple files to s3
router.post(
  "/multiple",
  userProtect,
  uploadFile.array("images", 10),
  async (req, res) => {
    // configuring the AWS environment
    AWS.config.update({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      signatureVersion: "v4",
    });

    const s3 = new AWS.S3();
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileUploadPromises = req.files.map(async (file) => {
      const fileName = `${Date.now()}_${file.originalname.replace(" ", "_")}`;
      const resizedFilePath = `from/resized_${fileName}`; // Temporary file path for resized image

      console.log(`Original file path: ${file.path}`);
      console.log(`Resized file path: ${resizedFilePath}`);

      // Resize the image if needed
      const finalFilePath = await resizeImageIfNeeded(
        file.path,
        resizedFilePath
      );

      const fileContent = fs.readFileSync(finalFilePath);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: fileContent,
        Key: fileName,
      };

      return new Promise((resolve, reject) => {
        s3.upload(params, async function (err, data) {
          if (err) {
            console.log("Error", err);
            reject(err);
          } else {
            try {
              const fileRecord = new File({
                user: req.user._id,
                url: data.Location,
              });
              await fileRecord.save();
              console.log("File saved to database:", fileRecord);

              try {
                await deleteFileWithRetry(resizedFilePath);
                await deleteFileWithRetry(file.path);
              } catch (deleteError) {
                console.log("Error deleting file:", deleteError);
              }

              resolve(data.Location);
            } catch (dbError) {
              console.log("Database error:", dbError);
              reject(dbError);
            }
          }
        });
      });
    });

    try {
      const fileUrls = await Promise.all(fileUploadPromises);
      res.status(200).json({ urls: fileUrls });
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: "Uploading Files Failed" });
    }
  }
);

// uploads profile picture to s3
router.post(
  "/profile-picture",
  userProtect,
  uploadFile.single("image"),
  async (req, res) => {
    // configuring the AWS environment
    AWS.config.update({
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      signatureVersion: "v4",
    });

    const s3 = new AWS.S3();
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = `${Date.now()}_${req.file.originalname.replace(
        " ",
        "_"
      )}`;
      const resizedFilePath = `from/resized_${fileName}`; // Temporary file path for resized image

      console.log(`Original file path: ${req.file.path}`);
      console.log(`Resized file path: ${resizedFilePath}`);

      // Resize the image if needed
      const finalFilePath = await resizeImageIfNeeded(
        req.file.path,
        resizedFilePath
      );

      const fileContent = fs.readFileSync(finalFilePath);

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: fileContent,
        Key: fileName,
      };

      s3.upload(params, async function (err, data) {
        // handle error
        if (err) {
          console.log("there was an error");
          console.log("Error", err);

          return res.status(500).json({ message: "Uploading File Failed" });
        }

        // success
        if (data) {
          console.log(data);
          console.log("Uploaded in:", data.Location);
          // Save the file URL to the database
          try {
            const user = await User.findByIdAndUpdate(
              req.user._id,
              {
                profile_pic: data.Location,
              },
              {
                new: true,
              }
            );

            if (!user) throw new Error("failed to update profile picture");
          } catch (dbError) {
            console.log("Database error:", dbError);
            return res.status(500).json({ message: "Saving File URL Failed" });
          }

          try {
            console.log(
              "file paths \n",
              "file: ",
              req.file.path,
              "\n",
              "resized file: ",
              resizedFilePath
            );

            await deleteFileWithRetry(resizedFilePath); // Remove the resized file if it was created
            await deleteFileWithRetry(req.file.path);
          } catch (deleteError) {
            console.log("Error deleting file:", deleteError);
          }

          return res.status(201).json({ profile_pic: data.Location });
        }
      });
    } catch (e) {
      try {
        await deleteFileWithRetry(req.file.path);
        await deleteFileWithRetry(resizedFilePath);
      } catch (deleteError) {
        console.log("Error deleting file:", deleteError);
      }
      console.log(e.message);
      res.status(500).json({ message: "error" });
    }
  }
);

module.exports = router;
