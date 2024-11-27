module.exports = async (req, res) => {
  const { password } = req.body;

  try {
    const user = req?.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = password;
    await user.save();

    return res.status(201).json({
      message: "Reset password successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
