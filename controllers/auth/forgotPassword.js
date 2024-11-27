const User = require("../../models/User");
const UserVerification = require("../../models/UserVerification");
const { generateRandomToken } = require("../../utils/generateRandomToken");
const sendEmail = require("../../utils/sendMail.js");

module.exports = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    //expire all previous token
    await UserVerification.updateMany(
      { user: user._id },
      { $set: { isExpired: true } }
    );

    const token = generateRandomToken(6);
    const userVerication = new UserVerification({
      user: user._id,
      token,
    });
    await userVerication.save();

    // do smtp otp verification here then implement below
    const text = `Reset password verification code.`;
    const html = `<p>To reset your password, please use the 6-digit reset code mentioned below.</p></b><p>${token}</p>`;
    const mailsended = await sendEmail(
      user.email,
      "Reset password verification code.",
      text,
      html
    );
    if (!mailsended)
      return res
        .status(500)
        .json({ message: "Error sending verification email" });

    return res.status(201).json({
      message: "Please check your email for verification code.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
