import express from "express";
import {
  // Experience Controllers
  createExperience,
  toggleExperienceStatus,
  getUserExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,

  // Education Controllers
  createEducation,
  toggleEducationStatus,
  getUserEducations,
  getEducationById,
  updateEducation,
  deleteEducation,

  // Skills Controllers
  getSkills,
  toggleSkillStatus,
  createSkill,
  updateSkill,
  deleteSkill,

  // Languages Controllers
  getLanguages,
  toggleLanguageStatus,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from "./BuildResume.controller.js"; // Adjust path as per your structure
import { protect } from '../../middleware/auth.Middleware.js' // Your auth middleware

const buildResumeRoute = express.Router();

// Apply auth middleware to all routes
buildResumeRoute.use(protect);

// =============================================
// ✅ EXPERIENCE ROUTES
// =============================================

/**
 * @route   POST /api/experiences
 * @desc    Create new experience
 * @access  Private
 */
buildResumeRoute.post("/experiences", createExperience);

buildResumeRoute.patch('/experiences/:id/toggle-status', toggleExperienceStatus);

/**
 * @route   GET /api/experiences
 * @desc    Get all experiences for logged in user
 * @access  Private
 */

buildResumeRoute.get("/experiences", getUserExperiences);

/**
 * @route   GET /api/experiences/:id
 * @desc    Get single experience by ID
 * @access  Private
 */
buildResumeRoute.get("/experiences/:id", getExperienceById);

/**
 * @route   PUT /api/experiences/:id
 * @desc    Update experience
 * @access  Private
 */
buildResumeRoute.put("/experiences/:id", updateExperience);

/**
 * @route   DELETE /api/experiences/:id
 * @desc    Delete experience (soft delete)
 * @access  Private
 */
buildResumeRoute.delete("/experiences/:id", deleteExperience);

// =============================================
// ✅ EDUCATION ROUTES
// =============================================

/**
 * @route   POST /api/educations
 * @desc    Create new education
 * @access  Private
 */
buildResumeRoute.post("/educations", createEducation);

buildResumeRoute.patch('/educations/:id/toggle-status', toggleEducationStatus);

/**
 * @route   GET /api/educations
 * @desc    Get all educations for logged in user
 * @access  Private
 */
buildResumeRoute.get("/educations", getUserEducations);

/**
 * @route   GET /api/educations/:id
 * @desc    Get single education by ID
 * @access  Private
 */
buildResumeRoute.get("/educations/:id", getEducationById);

/**
 * @route   PUT /api/educations/:id
 * @desc    Update education
 * @access  Private
 */
buildResumeRoute.put("/educations/:id", updateEducation);

/**
 * @route   DELETE /api/educations/:id
 * @desc    Delete education (soft delete)
 * @access  Private
 */
buildResumeRoute.delete("/educations/:id", deleteEducation);



buildResumeRoute.get('/skills', getSkills);

buildResumeRoute.patch('/skills/:id/toggle-status', toggleSkillStatus);
buildResumeRoute.post('/skills', createSkill);
buildResumeRoute.put('/skills/:id', updateSkill);
buildResumeRoute.delete('/skills/:id', deleteSkill);



buildResumeRoute.post('/languages', createLanguage);
buildResumeRoute.patch('/languages/:id/toggle-status', toggleLanguageStatus);
buildResumeRoute.get('/languages', getLanguages);
buildResumeRoute.put('/languages/:id', updateLanguage);
buildResumeRoute.delete('/languages/:id', deleteLanguage);

export default buildResumeRoute;