import express from "express";
import multer from "multer";
import {protect} from '../../middleware/auth.Middleware.js'
import {
  createJobPost,
  getAllJobPosts,
  getJobPost,
  updateJobPost,
  deleteJobPost,
  getAllActiveJobPosts,
  getEmployerJobs,
  toggleJobStatus
} from "./jobPost.controller.js";

const JObPostRouter = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/jobPost"); // folder must exist
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
JObPostRouter.post("/",protect, upload.single("file_attach"), createJobPost);

JObPostRouter.get("/active", getAllActiveJobPosts);
JObPostRouter.get("/",protect, getAllJobPosts);
JObPostRouter.patch("/:id/toggle-status", protect, toggleJobStatus);
JObPostRouter.get("/:id", getJobPost);
JObPostRouter.put("/:id",protect, upload.single("file_attach"), updateJobPost);
JObPostRouter.delete("/:id",protect, deleteJobPost);

JObPostRouter.get("/employer/my-jobs",protect, getEmployerJobs);

export default JObPostRouter;
