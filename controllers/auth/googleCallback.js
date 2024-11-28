const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt.js");

module.exports = async (req, res) => {
  try {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    // Save refresh token in the database
    req.user.refreshToken = refreshToken;
    await req.user.save();

    // res.redirect(`/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error("Error during Google callback:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
