const ImageGeneration = require("../../models/ImageGeneration.js");

module.exports = async (req, res) => {
  const { job_id, job_status, generated_images } = req.body.data;

  try {
    console.log("Generate Webhook Hitted with: ", req.body.data);
    const imageGeneration = await ImageGeneration.findOne({ jobId: job_id });
    if (!imageGeneration)
      return res.status(404).json({ message: "Job not found" });

    if (job_status === "done") {
      imageGeneration.generatedUrl = generated_images; // Save the generated image URL
      imageGeneration.status = "Completed";
      await imageGeneration.deductCredits();

      //   await imageGeneration.save();
    } else {
      imageGeneration.status = "Failed";
      await imageGeneration.save();
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
