// 📘 Create CMS Content

import CMSContentModel from "./CMSPages.model.js";
// ✅ Create CMS Content
export const createCMSContent = async (req, res) => {
  try {
    const content = await CMSContentModel.create(req.body);
    res.status(201).json({ success: true, data: content });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get All CMS Content (with populated page info)
export const getAllCMSContent = async (req, res) => {
  try {
    const contents = await CMSContentModel.find()
      .populate("page", "name status")
      .sort({ createdAt: -1 });
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get One
export const getCMSContentById = async (req, res) => {
  try {
    const content = await CMSContentModel.findById(req.params.id).populate("page", "name status");
    if (!content) return res.status(404).json({ success: false, message: "Content not found" });
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update
export const updateCMSContent = async (req, res) => {
  try {
    const updated = await CMSContentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Content not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete
export const deleteCMSContent = async (req, res) => {
  try {
    await CMSContentModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};