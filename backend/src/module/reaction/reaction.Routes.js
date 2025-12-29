import express from 'express';
import { addReaction, getReactions } from './reaction.controller.js';

const ReactionRouter = express.Router();

ReactionRouter.post('/add', addReaction);
ReactionRouter.get('/:blogId', getReactions);

export default ReactionRouter;