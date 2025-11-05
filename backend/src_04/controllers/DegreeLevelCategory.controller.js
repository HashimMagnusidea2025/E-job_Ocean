import DegreeLevelCategoryModel from "../models/DegreeLevelCategory.model.js";

// Create a new DegreeLevel Category
export const createDegreeLevelCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await DegreeLevelCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new DegreeLevelCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all DegreeLevel Categories
export const getAllDegreeLevelCategories = async (req, res) => {
    try {
        const categories = await DegreeLevelCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single DegreeLevel Category by ID
export const getDegreeLevelCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await DegreeLevelCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a DegreeLevel Category
export const updateDegreeLevelCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await DegreeLevelCategoryModel.findByIdAndUpdate(
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

// Delete a DegreeLevel Category

export const deleteDegreeLevelCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await DegreeLevelCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get only Active DegreeLevel Categories
export const getActiveDegreeLevelCategories = async (req, res) => {
    try {
        const categories = await DegreeLevelCategoryModel.find({ status: "active" }).sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

