import express from "express";
import AuthController from "../controllers/auth.controller.js";
import {protect} from '../middleware/auth.Middleware.js'

const AuthRoute = express.Router();

AuthRoute.post("/register", AuthController.register);
AuthRoute.post("/login", AuthController.login);
AuthRoute.get("/me", protect, AuthController.getMe);

export default AuthRoute;
