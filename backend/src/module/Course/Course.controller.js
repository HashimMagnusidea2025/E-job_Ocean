import CourseSchemaModel from "./Course.model.js";

// Create Course
export const createCourse = async (req, res) => {
  try {
    if (req.files && req.files.image && req.files.image.length > 0) {
      req.body.image = req.files.image[0].path;
    }
    if (req.files && req.files.courseFile && req.files.courseFile.length > 0) {
      req.body.courseFile = req.files.courseFile[0].path;
    }
    // Handle empty instructor and category fields
    if (req.body.instructor === '' || req.body.instructor === 'undefined') {
      req.body.instructor = undefined;
    }
    if (req.body.category === '' || req.body.category === 'undefined') {
      req.body.category = undefined;
    }
    const course = await CourseSchemaModel.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get All Courses (CourseList)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseSchemaModel.find().populate('category').populate('instructor').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await CourseSchemaModel.findById(req.params.id).populate('category').populate('instructor');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Course
export const updateCourse = async (req, res) => {
  try {
    if (req.files && req.files.image && req.files.image.length > 0) {
      req.body.image = req.files.image[0].path;
    }
    if (req.files && req.files.courseFile && req.files.courseFile.length > 0) {
      req.body.courseFile = req.files.courseFile[0].path;
    }
    // Handle empty instructor and category fields
    if (req.body.instructor === '' || req.body.instructor === 'undefined') {
      req.body.instructor = undefined;
    }
    if (req.body.category === '' || req.body.category === 'undefined') {
      req.body.category = undefined;
    }
    const course = await CourseSchemaModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const course = await CourseSchemaModel.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};