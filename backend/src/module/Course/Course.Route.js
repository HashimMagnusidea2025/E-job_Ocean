import express from "express";
import multer from "multer";
import path from "path";
import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "./Course.controller.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/course"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const CourseRouter = express.Router();

CourseRouter.post("/", upload.single('image'), createCourse);
CourseRouter.get("/", getAllCourses);
CourseRouter.put("/:id", upload.single('image'), updateCourse);
CourseRouter.delete("/:id", deleteCourse);

export default CourseRouter;