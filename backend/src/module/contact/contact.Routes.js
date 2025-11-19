import express from 'express';

import { createContact ,getAllContact,deleteContact} from "./contact.controller.js";


const ContactRoute = express.Router();

ContactRoute.post('/',createContact);

ContactRoute.get('/',getAllContact);
ContactRoute.delete('/:id',deleteContact);

export default ContactRoute;