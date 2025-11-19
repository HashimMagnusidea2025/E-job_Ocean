import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { protect } from '../middleware/auth.Middleware.js'

const AuthRoute = express.Router();


AuthRoute.post("/send-otp-email", AuthController.sendOtpEmail);
AuthRoute.post("/send-otp", AuthController.sendOtp);
AuthRoute.post("/verify-otp", AuthController.verifyOtp);

    
AuthRoute.post("/register", AuthController.register);
AuthRoute.post("/mentor-register", AuthController.MentorRegister);
AuthRoute.get("/mentors", AuthController.getAllMentors);
AuthRoute.get('/slug/:slug',AuthController.slugMentor)
AuthRoute.post("/approve-mentor", AuthController.approveMentor);
AuthRoute.post('/forgot-password', AuthController.forgetPassword);
AuthRoute.post('/reset-password/:token', AuthController.resetPassword)
AuthRoute.post("/login", AuthController.login);
AuthRoute.get("/me", protect, AuthController.getMe);

export default AuthRoute;
