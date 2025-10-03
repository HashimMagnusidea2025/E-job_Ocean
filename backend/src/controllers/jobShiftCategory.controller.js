import jobShiftCategoryModel from "../models/jobShiftCategory.model.js";

// Create a new jobShift Category
export const createjobShiftCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await jobShiftCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new jobShiftCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all jobShift Categories
export const getAlljobShiftCategories = async (req, res) => {
    try {
        const categories = await jobShiftCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single jobShift Category by ID
export const getjobShiftCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await jobShiftCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a jobShift Category
export const updatejobShiftCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await jobShiftCategoryModel.findByIdAndUpdate(
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

// Delete a jobShift Category
export const deletejobShiftCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await jobShiftCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get only Active jobShift Categories
export const getActiveJobShiftCategories = async (req, res) => {
    try {
        const activeCategories = await jobShiftCategoryModel
            .find({ status: "active" })   // sirf active filter
            .sort({ createdAt: -1 });

        res.json(activeCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

