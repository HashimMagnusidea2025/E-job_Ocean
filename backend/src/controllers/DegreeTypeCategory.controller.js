import DegreeTypeCategoryModel from "../models/DegreeTypeCategory.model.js";

// Create a new DegreeType Category
export const createDegreeTypeCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await DegreeTypeCategoryModel.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new DegreeTypeCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all DegreeType Categories
export const getAllDegreeTypeCategories = async (req, res) => {
    try {
        const categories = await DegreeTypeCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single DegreeType Category by ID
export const getDegreeTypeCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await DegreeTypeCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a DegreeType Category
export const updateDegreeTypeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await DegreeTypeCategoryModel.findByIdAndUpdate(
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

// Delete a DegreeType Category

export const deleteDegreeTypeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await DegreeTypeCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get only Active DegreeType Categories
export const getActiveDegreeTypeCategories = async (req, res) => {
    try {
        const categories = await DegreeTypeCategoryModel.find({ status: "active" }).sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

