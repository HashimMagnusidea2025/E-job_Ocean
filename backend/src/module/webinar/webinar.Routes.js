import express from 'express';
import multer from "multer";
import path from "path";
import { protect } from '../../middleware/auth.Middleware.js';
import { CreateWebinar, getWebinars,getWebinarBySlug, getWebinarById, updateWebinar, deleteWebinar,createGoogleEvent } from './webinar.controller.js';
const WebinarRouter = express.Router();



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/webinars"); // folder uploads/webinars
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


WebinarRouter.post('/', upload.fields([
    { name: "WebinarImage", maxCount: 1 },
    { name: "WebinarLogo", maxCount: 1 },
    { name: "WebinarVideoOptional", maxCount: 1 },
]), protect, CreateWebinar);




WebinarRouter.get('/', getWebinars);

WebinarRouter.get('/:id', getWebinarById);

WebinarRouter.put('/:id', upload.fields([
    { name: "WebinarImage", maxCount: 1 },
    { name: "WebinarLogo", maxCount: 1 },
]), updateWebinar);

WebinarRouter.delete('/:id', deleteWebinar);
WebinarRouter.post("/:id/create-google-event", createGoogleEvent);
WebinarRouter.get('/slug/:slug',getWebinarBySlug);
export default WebinarRouter




