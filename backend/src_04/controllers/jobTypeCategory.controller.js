import jobTypeCategoryModel from "../models/jobTypeCategory.model.js";

// Create a new jobType Category
export const createjobTypeCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await jobTypeCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new jobTypeCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all jobType Categories
export const getAlljobTypeCategories = async (req, res) => {
    try {
        const categories = await jobTypeCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single jobType Category by ID
export const getjobTypeCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await jobTypeCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a jobType Category
export const updatejobTypeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await jobTypeCategoryModel.findByIdAndUpdate(
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

// Delete a jobType Category
export const deletejobTypeCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await jobTypeCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get only Active jobType Categories
export const getActiveJobTypeCategories = async (req, res) => {
    try {
        const activeCategories = await jobTypeCategoryModel.find({ status: "active" }).sort({ createdAt: -1 });
        res.json(activeCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

