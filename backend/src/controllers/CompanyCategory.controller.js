import CompanyCategoryModel from "../models/CompanyCategory.model.js";

// Create a new Company Category
export const createCompanyCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await CompanyCategoryModel.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new CompanyCategoryModel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Company Categories
export const getAllCompanyCategories = async (req, res) => {
    try {
        const categories = await CompanyCategoryModel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single Company Category by ID
export const getCompanyCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CompanyCategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Company Category
export const updateCompanyCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await CompanyCategoryModel.findByIdAndUpdate(
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

// Delete a Company Category
export const deleteCompanyCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await CompanyCategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get only ACTIVE Company categories
export const getActiveCompanyCategories = async (req, res) => {
    try {
        const categories = await CompanyCategoryModel.find({ status: "active"});
        res.json(categories);
        
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
