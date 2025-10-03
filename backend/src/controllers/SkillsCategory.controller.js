import SkillsCategoryModel from "../models/SkillsCategory.model.js";

// Create a new Skills Category
export const createSkillsCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await SkillsCategoryModel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new SkillsCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Skills Categories
export const getAllSkillsCategories = async (req, res) => {
    try {
        const categories = await SkillsCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single Skills Category by ID
export const getSkillsCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await SkillsCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Skills Category
export const updateSkillsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await SkillsCategoryModel.findByIdAndUpdate(
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

// Delete a Skills Category
export const deleteSkillsCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await SkillsCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get only Active Skills Categories
export const getActiveSkillsCategories = async (req, res) => {
    try {
        const activeCategories = await SkillsCategoryModel
            .find({ status: "active" })   // sirf active
            .sort({ createdAt: -1 });

        res.json(activeCategories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

