const Promo = require("../../models/Promo.js");
module.exports = async (req, res) => {
  const { name, code, description, expiresAt, maximumUse, plan, deduct } =
    req.body;

  try {
    const promo = new Promo({
      name,
      code,
      description,
      expiresAt,
      maximumUse,
      plan,
      deduct,
    });

    await promo.save();
    return res
      .status(201)
      .json({ message: "Promo created successfully", promo });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Promo code already exists" });
    }
    return res
      .status(500)
      .json({ message: "Error creating promo", error: error.message });
  }
};
