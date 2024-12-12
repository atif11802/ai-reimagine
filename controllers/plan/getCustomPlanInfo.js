const Plan = require("../../models/Plan.js");

module.exports = async (req, res) => {
  try {
    const { customCredit, customPrice } = req.body;

    const plan = await Plan.findOne({ isCustom: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (isNaN(customCredit) && isNaN(customPrice)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (customPrice !== null && customPrice !== undefined) {
      const creditPerUnit = plan.credit / plan.price;
      const credits = Math.round(creditPerUnit * customPrice);

      return res.status(200).json({ credits });
    } else if (customCredit !== null && customCredit !== undefined) {
      const pricePerCredit = plan.price / plan.credit;
      const price = (pricePerCredit * customCredit).toFixed(2);

      return res.status(200).json({ price });
    }

    throw new Error("invalid params");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching plan", error: error.message });
  }
};
