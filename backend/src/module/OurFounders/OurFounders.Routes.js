import express from 'express';
import { getAllOurFounders, createOurFounder, updateOurFounder, deleteOurFounder } from './OurFounders.controller.js';
import upload from '../../middleware/multer.middleware.js';

const router = express.Router();

router.get('/', getAllOurFounders);
router.post('/', upload.single('image'), createOurFounder);
router.put('/:id', upload.single('image'), updateOurFounder);
router.delete('/:id', deleteOurFounder);

export default router;