import express from 'express';

import { createKnowledgeBaseRegister,getAllKnowledgeBaseRegisters,deleteKnowledgeBaseRegister } from './knowlegeBaseRegister.controller.js';
const knowlegeBaseRegisterRouter = express.Router();


knowlegeBaseRegisterRouter.post('/',createKnowledgeBaseRegister);

knowlegeBaseRegisterRouter.get('/',getAllKnowledgeBaseRegisters);
knowlegeBaseRegisterRouter.get('/:id',deleteKnowledgeBaseRegister);

export default knowlegeBaseRegisterRouter;

