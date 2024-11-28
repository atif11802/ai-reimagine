const User = require("../../models/User.js");
const {
  isValidPhoneNumber,
  isValidWebsiteUrl,
} = require("../../utils/validateArgs.js");

module.exports = async (req, res) => {
  const {
    name,
    email,
    profession,
    company,
    website,
    country,
    phone,
    password,
    isAdmin,
    isVerified,
  } = req.body;

  try {
    const id = req.params.id;
    const user = await User.findById(id ? id : req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure that the user can only update themselves, or an admin can update any user
    if (
      req?.user?._id?.toString() !== user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own account" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) if (password) user.password = password; // Will be hashed by the pre-save middleware
    if (typeof isAdmin !== "undefined" && req.user.isAdmin)
      user.isAdmin = isAdmin;
    if (typeof isVerified !== "undefined" && req.user.isAdmin)
      user.isVerified = isVerified;

    if (profession) user.profession = profession;
    if (company) user.company = company;
    if (country) user.country = country;
    if (website) user.website = website;

    if (phone) {
      const number = isValidPhoneNumber(phone);
      if (number) {
        user.phone = number;
      }
    }

    await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        profession: user.profession,
        company: user.company,
        website: user.website,
        country: user.country,
        phone: user.phone,
        profile_pic: user.profile_pic,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
