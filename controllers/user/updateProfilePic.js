const User = require("../../models/User.js");
const AWS = require("aws-sdk");
const fs = require("fs");

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
		// Return response
		return res.status(200).json({
			message: "User Profile Pic Updated Successfully",
			user: {
				...user,
			},
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error updating user", error: error.message });
	}
};

module.exports = updateProfilePic;
