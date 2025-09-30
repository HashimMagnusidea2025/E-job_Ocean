import express from "express";
import multer from "multer";
import {
  createJobPost,
  getAllJobPosts,
  getJobPost,
  updateJobPost,
  deleteJobPost
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
JObPostRouter.post("/", upload.single("file_attach"), createJobPost);
JObPostRouter.get("/", getAllJobPosts);
JObPostRouter.get("/:id", getJobPost);
JObPostRouter.put("/:id", upload.single("file_attach"), updateJobPost);
JObPostRouter.delete("/:id", deleteJobPost);

export default JObPostRouter;
