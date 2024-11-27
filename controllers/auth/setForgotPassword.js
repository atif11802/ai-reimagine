const User = require("../../models/User");
const UserVerification = require("../../models/UserVerification");

module.exports = async (req, res) => {
  const { email, token, password, confirm_password } = req.body;

  try {
    if (
      !email ||
      !token ||
      !password ||
      !confirm_password ||
      password !== confirm_password
    )
      return res
        .status(400)
        .json({ message: "Missing or invalid credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userVerication = await UserVerification.findOne({
      token,
      isExpired: false,
    }).populate("user");

    if (!userVerication)
      return res.status(400).json({ message: "Invalid or expired token" });

    if (userVerication.user._id.toString() !== user._id.toString())
      return res.status(400).json({ message: "Invalid credentials" });

    user.password = password;
    await user.save();

    return res.status(201).json({
      message: "Updated password successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
