import EstablishedInCategorymodel from "../models/EstablishedInCategory.model.js";

// Create a new EstablishedIn Category
export const createEstablishedInCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await EstablishedInCategorymodel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new EstablishedInCategorymodel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all EstablishedIn Categories
export const getAllEstablishedInCategories = async (req, res) => {
    try {
        const categories = await EstablishedInCategorymodel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single EstablishedIn Category by ID
export const getEstablishedInCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await EstablishedInCategorymodel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a EstablishedIn Category
export const updateEstablishedInCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await EstablishedInCategorymodel.findByIdAndUpdate(
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

// Delete a EstablishedIn Category
export const deleteEstablishedInCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await EstablishedInCategorymodel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get only ACTIVE NoofOffice categories
export const getActiveEstablishedInCategories = async (req, res) => {
  try {
    const categories = await EstablishedInCategorymodel.find({ status: "active" });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
