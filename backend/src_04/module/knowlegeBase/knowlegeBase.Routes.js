// backend/routes/knowlegeBaseRoutes.js
import express from "express";
import multer from "multer";
import {
  createknowlegeBase,
  getknowlegeBase,
  getKnowlegeBaseById,
  updateKnowlegeBase,
  deleteKnowlegeBase,
  incrementKnowledgeBaseCount
} from "./knowlegeBase.controller.js";

const KnowlegeBaseRouter = express.Router();

// multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/knowledgeBase"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "")),
});

const upload = multer({ storage });

// Routes
KnowlegeBaseRouter.post("/", upload.single("uploadPDF"), createknowlegeBase);
KnowlegeBaseRouter.get("/", getknowlegeBase);
KnowlegeBaseRouter.get("/:id", getKnowlegeBaseById);
KnowlegeBaseRouter.put("/:id", upload.single("uploadPDF"), updateKnowlegeBase);
KnowlegeBaseRouter.delete("/:id", deleteKnowlegeBase);
KnowlegeBaseRouter.post("/:id/increment", incrementKnowledgeBaseCount);

export default KnowlegeBaseRouter;
