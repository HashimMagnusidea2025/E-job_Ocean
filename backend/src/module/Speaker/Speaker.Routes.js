import express from 'express';
import multer from 'multer';
import path from 'path';
import { CreateSpeaker, deleteSpeaker, getSpeakerById, getSpeakers, updateSpeaker,getActiveSpeakers,getSpeakerByIdsafe,getSpeakerBySlug } from './Speaker.controller.js';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/speakers");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });


const SpeakerRouter = express.Router();


SpeakerRouter.post('/', upload.single("profilePic"), CreateSpeaker);

SpeakerRouter.get('/active',getActiveSpeakers);
SpeakerRouter.get("/:id", getSpeakerByIdsafe);
SpeakerRouter.get('/', getSpeakers);
SpeakerRouter.get('/:slug', getSpeakerBySlug);

SpeakerRouter.get('/:id', getSpeakerById);

SpeakerRouter.put('/:id', upload.single("profilePic"), updateSpeaker);

SpeakerRouter.delete('/:id', deleteSpeaker);




export default SpeakerRouter;