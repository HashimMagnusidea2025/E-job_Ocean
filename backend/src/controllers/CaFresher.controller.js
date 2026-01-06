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
    const caFreshers = await CaFresherModel.find().sort({ createdAt: -1 }); 

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




export const importcaRegistrations = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const jsonData = JSON.parse(req.file.buffer.toString());
   
    const formattedData = jsonData.map((item) => ({
      CA_Id: item.id, 
      name: item.name,
      email: item.email,
      phone: item.phone,
      qualification: item.qualification,
      experience: item.experience,
      jobProfile: item.jobprofile,
      jobLocation: item.joblocation,
      passingMonth: item.month,
      passingYear: item.year,
      other: item.other || null,
      ResumeUpload: item.uploaddocument
    }));
    await CaFresherModel.insertMany(formattedData);
    res.json({
      message: "Data imported successfully",
      count: formattedData.length,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({
      message: "Failed to import data",
      error: err.message,
    });
  }
};
