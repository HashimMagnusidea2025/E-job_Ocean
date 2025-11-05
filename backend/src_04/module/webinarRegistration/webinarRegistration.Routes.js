import express from 'express';


import { CreateWebinarRegistration,importWebinarRegistrations,updateWebinarRegistration,deleteWebinarRegistration ,CreateOneToOneRegistration, updateOneToOneRegistration,deleteOneToOneRegistration,getWebinarRegistrationsList,getOneToOneRegistrationsList ,getWebinarRegistration,createGoogleEvent,getWebinarRegistrationById } from "./webinarRegistration.controller.js";
import multer from "multer";
import path from "path";


const WebinarRegistrationRoute = express.Router();


// Multer setup to accept JSON file
const storage = multer.memoryStorage();
const upload = multer({ storage });

WebinarRegistrationRoute.post('/',CreateWebinarRegistration);
WebinarRegistrationRoute.post("/import", upload.single("file"), importWebinarRegistrations);

WebinarRegistrationRoute.get("/webinar", getWebinarRegistrationsList);
WebinarRegistrationRoute.put("/webinar/update/:id", updateWebinarRegistration);
WebinarRegistrationRoute.delete("/webinar/delete/:id", deleteWebinarRegistration);
WebinarRegistrationRoute.get("/one-to-one", getOneToOneRegistrationsList);
WebinarRegistrationRoute.post('/one-to-one',CreateOneToOneRegistration);
WebinarRegistrationRoute.put('/one-to-one/update/:id',updateOneToOneRegistration);
WebinarRegistrationRoute.delete('/one-to-one/delete/:id',deleteOneToOneRegistration);


WebinarRegistrationRoute.get("/:id", getWebinarRegistrationById);
WebinarRegistrationRoute.get('/',getWebinarRegistration);

WebinarRegistrationRoute.post("/:id/create-google-event", createGoogleEvent);

export default WebinarRegistrationRoute;