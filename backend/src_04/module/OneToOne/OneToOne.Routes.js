import express from 'express';
import { CreateOneToOne,GetOneToOne,GetOneToOneById, GetOneToOneBySpeaker,GetOneToOneByMentor,GetMyMentorSessions,updateOneToOne,DeleteOneToOne } from './OneToOne.controller.js';
import {protect} from '../../middleware/auth.Middleware.js'
const OneToOneRoute = express.Router();


OneToOneRoute.post('/',protect,CreateOneToOne);
OneToOneRoute.get('/',GetOneToOne);
OneToOneRoute.get('/my-sessions', protect, GetMyMentorSessions);
OneToOneRoute.get('/:id',GetOneToOneById);
OneToOneRoute.get('/speaker/:speakerId', GetOneToOneBySpeaker);
OneToOneRoute.get('/mentor/:mentorId', GetOneToOneByMentor);
OneToOneRoute.put('/:id',protect,updateOneToOne);
OneToOneRoute.delete('/:id',protect,DeleteOneToOne);

export default OneToOneRoute;