// routes/courseCategory.routes.js
import express from "express";
import {
  CreateCategory,
  GetAllCategories,
  UpdateCategory,
  DeleteCategory,
  ToggleCategoryStatus
} from "../controllers/CoursesCategory.controller.js";
import { protect } from "../middleware/auth.Middleware.js";

const Courserouter = express.Router();

Courserouter.post("/", CreateCategory);
Courserouter.get("/", GetAllCategories);
Courserouter.put("/:id", UpdateCategory);
Courserouter.patch("/toggle-status/:id", ToggleCategoryStatus);
Courserouter.delete("/:id", DeleteCategory);

export default Courserouter;
