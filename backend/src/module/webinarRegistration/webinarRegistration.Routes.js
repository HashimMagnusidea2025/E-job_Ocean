import express from 'express';


import { CreateWebinarRegistration,updateWebinarRegistration,deleteWebinarRegistration ,CreateOneToOneRegistration, updateOneToOneRegistration,deleteOneToOneRegistration,getWebinarRegistrationsList,getOneToOneRegistrationsList ,getWebinarRegistration,createGoogleEvent,getWebinarRegistrationById } from "./webinarRegistration.controller.js";



const WebinarRegistrationRoute = express.Router();


WebinarRegistrationRoute.post('/',CreateWebinarRegistration);
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