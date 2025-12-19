import express from "express";

import {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from "./Course.controller.js";

const CourseRouter = express.Router();

CourseRouter.post("/", createCourse);
CourseRouter.get("/", getAllCourses);
CourseRouter.put("/:id", updateCourse);
CourseRouter.delete("/:id", deleteCourse);

export default CourseRouter;