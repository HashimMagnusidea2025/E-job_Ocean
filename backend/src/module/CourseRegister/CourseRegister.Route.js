import express from 'express';
import {
  createCourseRegistration,
  getAllCourseRegistrations,
  getCourseRegistrationById
} from './CourseRegister.controller.js';

const CourseRegisterRouter = express.Router();

// Create course registration
CourseRegisterRouter.post('/', createCourseRegistration);

// Get all course registrations (admin)
CourseRegisterRouter.get('/', getAllCourseRegistrations);

// Get course registration by ID
CourseRegisterRouter.get('/:id', getCourseRegistrationById);

export default CourseRegisterRouter;