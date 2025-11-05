import knowlegeBaseRegisterModel from "./knowlegeBaseRegister.model.js";
import knowlegeBaseModel from "../knowlegeBase/knowlegeBase.model.js";


export const createKnowledgeBaseRegister = async (req, res) => {

  try {

    const { knowlegeBaseId, firstName, lastName, email, mobile } = req.body;

    if (!knowlegeBaseId || !firstName || !lastName || !email || !mobile) {
      return res.status(400).json({ success: false, message: "All Field are Required" })
    };

    const kbItem = await knowlegeBaseModel.findById(knowlegeBaseId);
    if (!kbItem) {
      return res.status(404).json({ success: false, message: "Knowledge Base not found" })
    }

    if (kbItem.fromStatus !== "Disabled") {
      return res.status(400).json({success:false, message:"Registration not allowed for Enabled items"});

    }

    const newEntry = await knowlegeBaseRegisterModel.create({

      knowlegeBaseId,
      firstName,
      lastName,
      email,
      mobile
    });
        // Increment count
    kbItem.count = (kbItem.count || 0) + 1;
    await kbItem.save();


    res.json({ success: true, message: " Registered Successfully", data: newEntry,updatedCount: kbItem.count  })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getAllKnowledgeBaseRegisters = async (req, res) => {

  try {
    const data = await knowlegeBaseRegisterModel.find().populate("knowlegeBaseId", "title description uploadPDF");
    res.json({ success: true, data });


  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}


// Delete a knowledge base registration by ID
export const deleteKnowledgeBaseRegister = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }

    const deleted = await knowlegeBaseRegisterModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    res.json({ success: true, message: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

