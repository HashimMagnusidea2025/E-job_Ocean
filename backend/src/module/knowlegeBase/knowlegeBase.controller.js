import knowlegeBaseModel from "./knowlegeBase.model.js";


export const createknowlegeBase = async (req, res) => {


    try {

        const { title, description, tags, keywords, fromStatus,status } = req.body;

        const uploadPDF = req.file ? req.file.path : null

        const newEntry = new knowlegeBaseModel({

            title,
            description,
            tags,
            keywords,
            fromStatus,
            status,
            uploadPDF
        });

        await newEntry.save();

        res.status(201).json({ success: true, data: newEntry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}


export const getknowlegeBase = async (req, res) => {


    try {

        const data = await knowlegeBaseModel.find().sort({ createdAt: -1 });

        res.json({ success: true, data })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
};



export const getKnowlegeBaseById = async (req, res) => {

    try {
        const data = await knowlegeBaseModel.findById(req.params.id);

        if (!data) return res.status(404).json({ success: false, message: "Not Found" });

        res.status({ success: true, data })


    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
};


export const updateKnowlegeBase = async (req, res) => {
  try {
    const uploadPDF = req.file ? req.file.path : req.body.uploadPDF;
    const updated = await knowlegeBaseModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, uploadPDF },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteKnowlegeBase = async (req, res) => {
  try {
    await knowlegeBaseModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const incrementKnowledgeBaseCount = async (req, res) => {
  try {
    const { id } = req.params;

    const kb = await knowlegeBaseModel.findById(id);
    if (!kb) return res.status(404).json({ success: false, message: "Knowledge base not found" });

    kb.count = (kb.count || 0) + 1;
    await kb.save();

    res.json({ success: true, updatedCount: kb.count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};