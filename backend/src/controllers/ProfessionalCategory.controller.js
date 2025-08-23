import ProfessionalCategoryModel from "../models/ProfessionalCategory.model.js";


// Create new category
export const CreateProfessionalCategory = async (req, res) => {

  try {
    const category = await ProfessionalCategoryModel.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get all categories
export const getAllProfessionalCategory = async (req, res) => {
  

  try {
    const category = await ProfessionalCategoryModel.find();
    res.status(200).json({ success: true, data: category });

  } catch (error) {
    res.status(200).json({ success: false, message: error.message });
  }
}

// Get one category by ID
export const getProfessionalCategoryById = async (req, res) => {
  try {

    const category = await ProfessionalCategoryModel.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" })
    }
    res.status(200).json({ success: true, data: category })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Update category
export const updateProfessionalCategory = async (req, res) => {
  try {
    const category = await ProfessionalCategoryModel.findByIdAndUpdate(
      req.params.id, req.body, { new: true })
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}



// Delete category
export const deleteProfessionalCategory = async (req, res) => {
  try {
    const category = await ProfessionalCategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Toggle status
export const toggleProfessionalCategoryStatus = async (req, res) => {
  try {
    const category = await ProfessionalCategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.status = category.status === "active" ? "inactive" : "active";
    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });

  }
};


// Grouped filter options controller
export const getGroupedProfessionalCategories = async (req, res) => {
  try {
    const all = await ProfessionalCategoryModel.find({ status: "active" });

    const grouped = {
      Qualification: [],
      Experience: [],
      Profile: [],
      
    };

    all.forEach(item => {
      if (grouped[item.type]) {
        grouped[item.type].push(item.name);
      }
    });

    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






