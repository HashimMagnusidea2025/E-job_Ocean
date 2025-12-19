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
} from "./BuildResume.controller.js"; 
import { protect } from '../../middleware/auth.Middleware.js' 

const buildResumeRoute = express.Router();

// Apply auth middleware to all routes
buildResumeRoute.use(protect);



/**
 * @route  
 * @desc    
 * @access 
 */
buildResumeRoute.post("/experiences", createExperience);

buildResumeRoute.patch('/experiences/:id/toggle-status', toggleExperienceStatus);

/**
 * @route 
 * @desc   
 * @access  
 */

buildResumeRoute.get("/experiences", getUserExperiences);

/**
 * @route   
 * @desc    
 * @access 
 */
buildResumeRoute.get("/experiences/:id", getExperienceById);

/**
 * @route   
 * @desc    
 * @access  
 */
buildResumeRoute.put("/experiences/:id", updateExperience);

/**
 * @route   
 * @desc    
 * @access  
 */
buildResumeRoute.delete("/experiences/:id", deleteExperience);



/**
 * @route   
 * @desc   
 * @access  
 */
buildResumeRoute.post("/educations", createEducation);

buildResumeRoute.patch('/educations/:id/toggle-status', toggleEducationStatus);

/**
 * @route  
 * @desc    
 * @access  
 */
buildResumeRoute.get("/educations", getUserEducations);

/**
 * @route   
 * @desc    
 * @access  
 */
buildResumeRoute.get("/educations/:id", getEducationById);

/**
 * @route  
 * @desc   
 * @access 
 */
buildResumeRoute.put("/educations/:id", updateEducation);

/**
 * @route  
 * @desc    
 * @access 
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


