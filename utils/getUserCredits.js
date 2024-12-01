const mongoose = require("mongoose");
const Credit = require("../models/Credit.js");
const ImageGeneration = require("../models/ImageGeneration.js");

const getUserCredits = async (userId) => {
  const creditsEarned = await Credit.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalEarned: { $sum: "$creditsEarned" } } },
  ]);

  const creditsUsed = await ImageGeneration.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: "Completed",
      },
    },
    { $group: { _id: null, totalUsed: { $sum: "$creditsUsed" } } },
  ]);

  const totalEarned = creditsEarned[0]?.totalEarned || 0;
  const totalUsed = creditsUsed[0]?.totalUsed || 0;

  return totalEarned - totalUsed;
};

module.exports = getUserCredits;
