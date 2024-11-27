const AWS = require("aws-sdk");

// Configure S3
const s3 = new AWS.S3({
	region: process.env.S3_REGION,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY,
	},
});

// File upload function
const uploadFileS3 = ({ fileName, fileContent, fileAcl = "private" }) => {
	const params = {
		Bucket: process.env.S3_BUCKET_NAME, // Use the S3 bucket name
		Key: fileName, // File path in the bucket
		Body: fileContent, // File content
		ACL: fileAcl, // File access control (e.g., private, public-read)
	};

	return s3.upload(params).promise();
};

module.exports = { s3, uploadFileS3 };
