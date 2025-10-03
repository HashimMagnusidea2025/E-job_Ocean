import express from "express";
import {
    createSkillsCategory,
    getAllSkillsCategories,
    getSkillsCategoryById,
    updateSkillsCategory,
    deleteSkillsCategory,
    getActiveSkillsCategories
} from "../controllers/SkillsCategory.controller.js";

const router = express.Router();

// Create
router.post("/", createSkillsCategory);

router.get("/active", getActiveSkillsCategories);

// Read all
router.get("/", getAllSkillsCategories);

// Read one
router.get("/:id", getSkillsCategoryById);

// Update
router.put("/:id", updateSkillsCategory);

// Delete
router.delete("/:id", deleteSkillsCategory);

export default router;
