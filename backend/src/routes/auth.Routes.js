import express from "express";
import AuthController from "../controllers/auth.controller.js";
import {protect} from '../middleware/auth.Middleware.js'

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", protect, AuthController.getMe);

export default router;
