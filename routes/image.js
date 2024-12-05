const express = require("express");
const userProtect = require("../middlewares/userProtect.js");
const createMask = require("../controllers/image/createMask.js");
const maskWebhook = require("../controllers/image/maskWebhook.js");
const generateImage = require("../controllers/image/generateImage.js");
const generateWebhook = require("../controllers/image/generateWebhook.js");
const callReimagine = require("../utils/callReimagine.js");
const getAllGeneratedImages = require("../controllers/image/getAllGeneratedImages.js");
const getGeneneratedImageByJobId = require("../controllers/image/getGeneneratedImageByJobId.js");
const getAllFavourite = require("../controllers/image/getAllFavourite.js");
const addToFavourite = require("../controllers/image/addToFavourite.js");
const getAllDownloaded = require("../controllers/image/getAllDownloaded.js");
const addToDownloaded = require("../controllers/image/addToDownloaded.js");
const getSolutionById = require("../controllers/image/getSolutionById.js");
const deleteGeneration = require("../controllers/image/deleteGeneration.js");

const router = express.Router();

router.get("/", userProtect, getAllGeneratedImages);

router.get("/solution/:id", userProtect, getSolutionById);

router.delete(
  "/image-generation/:imageGenerationId",
  userProtect,
  deleteGeneration
);

router.get("/favourite", userProtect, getAllFavourite);
router.put("/update-favourite", userProtect, addToFavourite);
router.get("/downloaded", userProtect, getAllDownloaded);
router.put("/add-to-downloaded", userProtect, addToDownloaded);

router.post("/create-mask", userProtect, createMask);
router.post("/webhook/mask", maskWebhook);
router.post("/generate-image", userProtect, generateImage);
router.get("/generate-image/:jobId", userProtect, getGeneneratedImageByJobId);
router.post("/webhook/generate", generateWebhook);

router.get("/job-status/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const response = await callReimagine(`/generate_image/${jobId}`, "GET");
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mask-status/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const response = await callReimagine(`/create_mask/${jobId}`, "GET");
    res.json(response?.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper APIs (space type, design theme, color preferences, ladnscaping-preferences)
router.get("/space-types", async (req, res) => {
  try {
    const response = await callReimagine("/get-space-type-list", "GET");
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/design-themes", async (req, res) => {
  try {
    const response = await callReimagine("/get-design-theme-list", "GET");
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/color-preferences", async (req, res) => {
  try {
    const response = await callReimagine("/get-color-preference-list", "GET");
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/landscaping-preferences", async (req, res) => {
  try {
    const response = await callReimagine(
      "/get-landscaping-preference-list",
      "GET"
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
