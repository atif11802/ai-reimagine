module.exports = async (req, res) => {
  const { password, confirm_password } = req.body;

  try {
    if (!password || !confirm_password || password !== confirm_password)
      return res
        .status(400)
        .json({ message: "Missing or invalid credentials" });

    const user = req?.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();

    return res.status(201).json({
      message: "Updated password successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
