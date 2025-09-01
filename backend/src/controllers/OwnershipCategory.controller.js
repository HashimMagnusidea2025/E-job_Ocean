import OwnershipCategorymodel from "../models/OwnershipCategory.model.js";

// Create a new Ownership Category
export const createOwnershipCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await OwnershipCategorymodel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new OwnershipCategorymodel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Ownership Categories
export const getAllOwnershipCategories = async (req, res) => {
    try {
        const categories = await OwnershipCategorymodel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single Ownership Category by ID
export const getOwnershipCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await OwnershipCategorymodel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Ownership Category
export const updateOwnershipCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await OwnershipCategorymodel.findByIdAndUpdate(
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

// Delete a Ownership Category
export const deleteOwnershipCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await OwnershipCategorymodel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get only ACTIVE ownership categories
export const getActiveOwnershipCategories = async (req, res) => {
  try {
    const categories = await OwnershipCategorymodel.find({ status: "active" });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


      