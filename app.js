require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const expressSession = require("express-session");
const connectDB = require("./utils/connectDb.js");
const helmet = require("helmet");
// routes
const authRoutes = require("./routes/auth.js");
const transactionRoute = require("./routes/transaction.js");
const planRoute = require("./routes/plan.js");
const adminRoute = require("./routes/admin/adminRoot.js");
const uploadRoute = require("./routes/upload.js");
const imageRoute = require("./routes/image.js");
const userRoute = require("./routes/user.js");
const projectRoute = require("./routes/project.js");

// cors options
const corsOptions = {
	origin: [
		"http://localhost:3000",
		"http://localhost:5000",
		"https://roomify.aiwritingwizard.net",
		"https://roomify-api.aiwritingwizard.net",
	],
};

// app initiate
const app = express();

// global middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport js initiated
require("./config/passport.js")(passport);

app.use(passport.initialize());

// session
// app.use(
//   expressSession({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     },
//   })
// );

// Database connection
if (process.env.ENVIRONMENT !== "TEST") {
	connectDB();
}

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoute);
app.use("/api/plan", planRoute);
app.use("/api/admin", adminRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/image", imageRoute);
app.use("/api/user", userRoute);
app.use("/api/project", projectRoute);

module.exports = app;
