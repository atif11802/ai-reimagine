// routes/auth.js
const express = require("express");
const passport = require("passport");

const localSignup = require("../controllers/auth/localSignup.js");
const verifyToken = require("../controllers/auth/verifyToken.js");
const localLogin = require("../controllers/auth/localLogin.js");
const googleCallback = require("../controllers/auth/googleCallback.js");
const refreshToken = require("../controllers/auth/refreshToken.js");
const logout = require("../controllers/auth/logout.js");
const getSelf = require("../controllers/auth/getSelf.js");
const router = express.Router();
const userProtect = require("../middlewares/userProtect.js");
const { multerErrorHandler } = require("../middlewares/multerErrorHandler.js");
const updateProfilePic = require("../controllers/user/updateProfilePic.js");
const resetPassword = require("../controllers/auth/resetPassword.js");
const forgotPassword = require("../controllers/auth/forgotPassword.js");
const setForgotPassword = require("../controllers/auth/setForgotPassword.js");
const multer = require("multer");
const uploadFile = multer({ dest: "from/" });
// Local Sign Up
router.post("/signup", localSignup);

router.get("/verify/:token", verifyToken);

// Local Login
router.post("/login", localLogin);

// Google Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

// Refresh Token Endpoint
router.post("/refresh-token", refreshToken);

// Logout (invalidate token on the client-side)
router.get("/logout", logout);

// get selt route for credits info
router.get("/self", userProtect, getSelf);
router.patch(
  "/update-profile-pic",
  userProtect,
  uploadFile.single("image"),
  updateProfilePic
);

router.patch("/reset-password", userProtect, resetPassword);

router.get("/forgot-password", forgotPassword);

router.patch("/set-forgot-password", setForgotPassword);

module.exports = router;
