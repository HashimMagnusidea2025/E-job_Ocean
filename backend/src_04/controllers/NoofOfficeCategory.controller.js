import NoofOfficeCategorymodel from "../models/NoofOfficeCategory.model.js";

// Create a new NoofOffice Category
export const createNoofOfficeCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await NoofOfficeCategorymodel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new NoofOfficeCategorymodel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all NoofOffice Categories
export const getAllNoofOfficeCategories = async (req, res) => {
    try {
        const categories = await NoofOfficeCategorymodel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single NoofOffice Category by ID
export const getNoofOfficeCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await NoofOfficeCategorymodel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a NoofOffice Category
export const updateNoofOfficeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await NoofOfficeCategorymodel.findByIdAndUpdate(
            id,
            { name, status },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a NoofOffice Category
export const deleteNoofOfficeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await NoofOfficeCategorymodel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get only ACTIVE NoofOffice categories
export const getActiveNoofOfficeCategories = async (req, res) => {
  try {
    const categories = await NoofOfficeCategorymodel.find({ status: "active" });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
