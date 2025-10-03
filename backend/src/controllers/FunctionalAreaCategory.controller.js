import FunctionalAreaCategoryModel from "../models/FunctionalAreaCategory.model.js";

// Create  new FunctionalArea Category
export const createFunctionalAreaCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await FunctionalAreaCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new FunctionalAreaCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all FunctionalArea Categories
export const getAllFunctionalAreaCategories = async (req, res) => {
    try {
        const categories = await FunctionalAreaCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get  single FunctionalArea Category by ID
export const getFunctionalAreaCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await FunctionalAreaCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update  FunctionalArea Category
export const updateFunctionalAreaCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await FunctionalAreaCategoryModel.findByIdAndUpdate(
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

// Delete   FunctionalArea Category

export const deleteFunctionalAreaCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await FunctionalAreaCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get all active Functional Area Categories
export const getActiveFunctionalAreaCategories = async (req, res) => {
    try {
        const categories = await FunctionalAreaCategoryModel.find({ status: "active" }).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

