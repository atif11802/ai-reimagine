const express = require('express');
const userProtect = require('../middlewares/userProtect.js');
const createMask = require('../controllers/image/createMask.js');
const maskWebhook = require('../controllers/image/maskWebhook.js');
const generateImage = require('../controllers/image/generateImage.js');
const generateWebhook = require('../controllers/image/generateWebhook.js');
const callReimagine = require('../utils/callReimagine.js');
const getAllGeneratedImages = require('../controllers/image/getAllGeneratedImages.js');
const getGeneneratedImageByJobId = require('../controllers/image/getGeneneratedImageByJobId.js');
const router = express.Router();

router.get('/', userProtect, getAllGeneratedImages);

router.post('/create-mask', userProtect, createMask);
router.post('/webhook/mask', maskWebhook);
router.post('/generate-image', userProtect, generateImage);
router.get('/generate-image/:jobId', userProtect, getGeneneratedImageByJobId);
router.post('/webhook/generate', generateWebhook);

router.get('/job-status/:jobId', async (req, res) => {
	const { jobId } = req.params;

	try {
		const response = await callReimagine(`/generate_image/${jobId}`, 'GET');
		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/mask-status/:jobId', async (req, res) => {
	const { jobId } = req.params;

	try {
		const response = await callReimagine(`/create_mask/${jobId}`, 'GET');
		res.json(response?.data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Helper APIs (space type, design theme, color preferences)
router.get('/space-types', async (req, res) => {
	try {
		const response = await callReimagine('/get-space-type-list', 'GET');
		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/design-themes', async (req, res) => {
	try {
		const response = await callReimagine('/get-design-theme-list', 'GET');
		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/color-preferences', async (req, res) => {
	try {
		const response = await callReimagine('/get-color-preference-list', 'GET');
		res.json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
