const ImageGeneration = require("../../models/ImageGeneration.js");
const Project = require("../../models/Project.js");
const Solution = require("../../models/Solution.js");
const callReimagine = require("../../utils/callReimagine.js");
const getUserCredits = require("../../utils/getUserCredits.js");

module.exports = async (req, res) => {
  const {
    solutionId = "",
    maskJobId = "",
    masks = [],
    spaceType = "",
    designTheme = "",
    colorPreference = "",
    materialPreference = "",
    landscapingPreference = "",
    maskingElement = "",
    generationCount = 1,
    additionalPrompt = "",
    maskCategory = "",
  } = req.body;

  console.log({ body: req.body });

  try {
    const solution = await Solution.findOne({
      _id: solutionId,
      user: req.user._id,
    });

    if (!solution) {
      return res.status(404).json({ message: "Solution Not Found" });
    }

    const imageUrl = solution.url;

    if (!imageUrl) {
      return res.status(404).json({ message: "Image Not Found in solution" });
    }

    let mask;
    let gettedMask = [];

    if (maskJobId) {
      mask = await ImageGeneration.findOne({ jobId: maskJobId });

      mask?.maskUrls.forEach((item) => {
        if (maskCategory === "architectural") {
          // if (item.name === maskingElement) {
          // 	gettedMask.push(item.url);
          // }

          const architecturalItems = item.category.split(",").find((cat) => {
            if (cat === "architectural") {
              return item;
            }
          });

          if (architecturalItems) {
            gettedMask.push(item.url);
          }
        } else {
          gettedMask.push(item.url);
        }
      });
    }

    const userCredits = await getUserCredits(req.user._id);

    if (
      userCredits === 0 ||
      userCredits < process.env.CREDITS_CONSUME_PER_REQUEST
    ) {
      return res.status(403).json({ message: "Insufficient Credit" });
    }

    const data = {
      design_theme: designTheme,
      space_type: spaceType,
      mask_category: maskCategory,
      color_preference: colorPreference,
      material_preference: materialPreference,
      masking_element: maskingElement,
      landscaping_preference: landscapingPreference,
      additional_prompt: additionalPrompt,
      image_url: imageUrl,
      mask_urls: mask?.maskUrls ? gettedMask : masks,
      generation_count: generationCount,
      webhook_url: `${process.env.BACKEND_URL}/api/image/webhook/generate`,
    };

    console.log({ data });

    if (designTheme === "DT-INT-010") {
      const filteredUrls = mask?.maskUrls
        .filter((item) => item.name !== "wall" && item.name !== "door")
        .map((item) => item.url);

      console.log({ filteredUrls });
      data.mask_urls = filteredUrls;
    }

    console.log({ data });

    const generateResponse = await callReimagine(
      "/generate_image",
      "POST",
      data
    );

    let projectExist = await Project.findOne({
      user: req.user._id,
      name: "Unassigned",
    });

    if (!projectExist) {
      projectExist = await Project.create({
        user: req.user._id,
        name: "Unassigned",
      });
    }

    const newJob = new ImageGeneration({
      user: req.user._id,
      imageUrl: imageUrl,
      type: "Generate",
      solutionId: solutionId,
      jobId: generateResponse?.data?.job_id,
      prompt: additionalPrompt,
      others: {
        maskCategory,
        maskJobId,
        spaceType,
        designTheme,
        colorPreference,
        materialPreference,
        landscapingPreference,
        generationCount,
      },
      creditsUsed:
        Number(process.env.CREDITS_CONSUME_PER_REQUEST) * generationCount,
      status: "Processing",
      project: projectExist?._id,
    });

    // await projectExist.media.push(newJob._id).save();
    await Project.findByIdAndUpdate(
      projectExist._id,
      { $push: { media: newJob._id } },
      { new: true }
    );

    const response = await callReimagine("/get-space-type-list", "GET");

    if (spaceType && response?.status === "success") {
      const allFields = [
        ...response?.data?.exterior_spaces,
        ...response?.data?.interior_spaces,
      ];

      const spaceTypeName = allFields.find((obj) => {
        if (obj[spaceType]) {
          return obj;
        }
      });

      if (spaceTypeName) {
        newJob.others.spaceTypeName = spaceTypeName[spaceType];
      }
    }

    await newJob.save();

    const solutionMedia = solution?.generated_image.length
      ? solution.generated_image
      : [];

    solutionMedia.push(newJob._id);

    solution.generated_image = solutionMedia;
    await solution.save();

    res.status(201).json({
      message: "Image generation started",
      jobId: generateResponse?.data?.job_id,
      solutionId: solutionId,
    });
  } catch (error) {
    if (error?.name === "AxiosError")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};
