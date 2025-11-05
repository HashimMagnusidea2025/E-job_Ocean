import express from 'express';
import multer from 'multer';
import path from 'path';

import {
    CreateJobRegisteration,
    GetAllJobRegistrations,
    GetRegistrationsByUser ,
    GetJobRegistrationById,
    UpdateJobRegistration,
    DeleteJobRegistration,
    GetRegistrationsByJobId
} from "./JobRegister.controller.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/jobRegisteResume");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });
const JobRegisterRoute = express.Router();


JobRegisterRoute.post('/', upload.single("resume"), CreateJobRegisteration);
// JobRegisterRoute.js में ये route add करें
JobRegisterRoute.get("/user/applications", GetRegistrationsByUser);
JobRegisterRoute.put("/:id", upload.single("resume"), UpdateJobRegistration);
JobRegisterRoute.get("/", GetAllJobRegistrations);
JobRegisterRoute.get("/job/:jobId", GetRegistrationsByJobId); // Naya route
JobRegisterRoute.get("/:id", GetJobRegistrationById);

JobRegisterRoute.delete("/:id", DeleteJobRegistration);


export default JobRegisterRoute
