import CareerCategoryModel from "../models/careerCategory.model.js";

// Create  new Career Category
export const createCareerCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await CareerCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new CareerCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Career Categories
export const getAllCareerCategories = async (req, res) => {
    try {
        const categories = await CareerCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get  single Career Category by ID
export const getCareerCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CareerCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update  Career Category
export const updateCareerCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await CareerCategoryModel.findByIdAndUpdate(
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

// Delete  Career Category
export const deleteCareerCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CareerCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
