import FoundedYearCategorymodel from "../models/FoundedYearCategory.model.js";

// Create a new FoundedYear Category
export const createFoundedYearCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await FoundedYearCategorymodel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new FoundedYearCategorymodel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all FoundedYear Categories
export const getAllFoundedYearCategories = async (req, res) => {
    try {
        const categories = await FoundedYearCategorymodel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single FoundedYear Category by ID
export const getFoundedYearCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await FoundedYearCategorymodel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a FoundedYear Category
export const updateFoundedYearCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await FoundedYearCategorymodel.findByIdAndUpdate(
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

// Delete a FoundedYear Category
export const deleteFoundedYearCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await FoundedYearCategorymodel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
