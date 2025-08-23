
import mongoose from "mongoose";

const CourseCategorySchema = new mongoose.Schema({
  CourseCategory: {
    type: String,
    required: true,
    unique: true
  },
 status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

const CourseCategoryModel = mongoose.model("Course_Category", CourseCategorySchema);

export default CourseCategoryModel;
