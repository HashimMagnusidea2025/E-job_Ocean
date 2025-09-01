import NoofEmployeesCategorymodel from "../models/NoofEmployeesCategory.model.js";

// Create a new Noof Employees Category
export const createNoofEmployeesCategory = async (req, res) => {
    try {
        const { name, status } = req.body;

        // Check if category already exists
        const existingCategory = await NoofEmployeesCategorymodel.findOne({ name: name.trim()});
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new NoofEmployeesCategorymodel({ name, status });
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all Noof Employees Categories
export const getAllNoofEmployeesCategories = async (req, res) => {
    try {
        const categories = await NoofEmployeesCategorymodel.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single Noof Employees Category by ID
export const getNoofEmployeesCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await NoofEmployeesCategorymodel.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a Noof Employees Category
export const updateNoofEmployeesCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        const updatedCategory = await NoofEmployeesCategorymodel.findByIdAndUpdate(
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

// Delete a Noof Employees Category
export const deleteNoofEmployeesCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await NoofEmployeesCategorymodel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get only ACTIVE NoofOffice categories
export const getActiveNoofEmployeesCategories = async (req, res) => {
  try {
    const categories = await NoofEmployeesCategorymodel.find({ status: "active" });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
