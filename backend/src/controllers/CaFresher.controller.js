import CaFresherModel from "../models/CaFresher.model.js";

export const CreateCAFresher = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      qualification,
      experience,
      jobProfile,
      jobLocation,
      passingMonth,
      passingYear,
    } = req.body;

    const ResumeUpload = req.file?.filename;

    if (!ResumeUpload) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const CaFresher = await CaFresherModel.create({
      name,
      email,
      phone,
      qualification,
      experience,
      jobProfile,
      jobLocation,
      passingMonth,
      passingYear,
      ResumeUpload,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted",
      data: CaFresher,
    });
  } catch (error) {
    console.error("CreateCAFresher error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





export const GetAllCAFresher = async (req, res) => {
  try {
    const caFreshers = await CaFresherModel.find().sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      message: "CA Freshers fetched successfully",
      data: caFreshers,
    });
  } catch (error) {
    console.error("GetAllCAFresher error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch CA Freshers",
    });
  }
};
