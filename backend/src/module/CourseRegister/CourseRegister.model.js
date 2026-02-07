
import mongoose from "mongoose";

const CourseRegisterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  pinCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  type: {
    type: String,
    default: 'course'
  },
  selectedPostOffice: {
    type: String,
    trim: true
  }
});


const CourseRegisterModel = mongoose.model('course-registers',CourseRegisterSchema);

export default CourseRegisterModel;


