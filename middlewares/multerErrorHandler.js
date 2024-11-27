const multerErrorHandler = (error, req, res, next) => {
	if (error) {
		if (error.code === "LIMIT_FILE_SIZE") {
			return res.status(413).send({
				code: 413,
				status: error.code,
				msg: error.message,
			});
		}

		return res.status(500).send({
			code: 500,
			status: error.code,
			msg: "Internal error with file upload",
		});
	} else {
		next();
	}
};

module.exports = { multerErrorHandler };
