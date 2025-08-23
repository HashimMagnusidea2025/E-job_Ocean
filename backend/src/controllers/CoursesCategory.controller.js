import CourseCategoryModel from "../models/CoursesCategory.model.js";

// Create Category
export const CreateCategory = async (req, res) => {
  try {
    const { CourseCategory, status = "active" } = req.body;

    const category = await CourseCategoryModel.create({ CourseCategory, status });

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Categories
export const GetAllCategories = async (req, res) => {
  try {
    const categories = await CourseCategoryModel.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Only Active Categories (Optional)
// export const GetActiveCategories = async (req, res) => {
//   try {
//     const categories = await CourseCategoryModel.find({ isActive: true });
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Update Category (name and isActive)
export const UpdateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { CourseCategory, status } = req.body;

    const updated = await CourseCategoryModel.findByIdAndUpdate(id, { CourseCategory, status }, { new: true });

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Toggle only isActive field
export const ToggleCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CourseCategoryModel.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.isActive = !category.isActive;
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Category
export const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await CourseCategoryModel.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
