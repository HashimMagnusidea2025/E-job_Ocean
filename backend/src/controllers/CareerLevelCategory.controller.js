import CareerLevelCategoryModel from "../models/careerLevelCategory.model.js";

// Create  new Career-Level Category
export const createCareerLevelCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await CareerLevelCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new CareerLevelCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Career-Level Categories
export const getAllCareerLevelCategories = async (req, res) => {
    try {
        const categories = await CareerLevelCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get  single Career-Level Category by ID
export const getCareerLevelCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CareerLevelCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update  Career-Level Category
export const updateCareerLevelCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await CareerLevelCategoryModel.findByIdAndUpdate(
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

// Delete  Career-Level Category
export const deleteCareerLevelCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CareerLevelCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
