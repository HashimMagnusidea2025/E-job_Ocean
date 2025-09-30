import express from 'express';
import { CreateOneToOne,GetOneToOne,GetOneToOneById, GetOneToOneBySpeaker,updateOneToOne,DeleteOneToOne } from './OneToOne.controller.js';

const OneToOneRoute = express.Router();


OneToOneRoute.post('/',CreateOneToOne);
OneToOneRoute.get('/',GetOneToOne);
OneToOneRoute.get('/:id',GetOneToOneById);
OneToOneRoute.get('/speaker/:speakerId', GetOneToOneBySpeaker);
OneToOneRoute.put('/:id',updateOneToOne);
OneToOneRoute.delete('/:id',DeleteOneToOne);

export default OneToOneRoute;