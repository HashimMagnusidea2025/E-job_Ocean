import express from 'express';
import multer from 'multer';
import path from 'path';
import { CreateSpeaker, deleteSpeaker, getSpeakerById, getSpeakers, updateSpeaker, getActiveSpeakers, getSpeakerByIdsafe, getSpeakerBySlug } from './Speaker.controller.js';


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

SpeakerRouter.get('/slug/:slug',getSpeakerBySlug);

SpeakerRouter.post('/', upload.single("profilePic"), CreateSpeaker);

SpeakerRouter.get('/active', getActiveSpeakers);
SpeakerRouter.get("/:id", getSpeakerByIdsafe);
SpeakerRouter.get('/', getSpeakers);
// SpeakerRouter.get('/slug/:slug', getSpeakerBySlug);

// SpeakerRouter.get('/:id', getSpeakerById);

SpeakerRouter.put('/:id', upload.single("profilePic"), updateSpeaker);

SpeakerRouter.delete('/:id', deleteSpeaker);

// Remove duplicate /:id routes
// Remove old getSpeakerBySlug route

SpeakerRouter.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        let speaker;

        // Check if identifier is a valid MongoDB ObjectId
        if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
            speaker = await SpeakerModel.findById(identifier)
                .populate("country")
                .populate("state")
                .populate("city");
        } else {
            speaker = await SpeakerModel.findOne({ slug: identifier })
                .populate("country")
                .populate("state")
                .populate("city");
        }

        if (!speaker) return res.status(404).json({ message: "Speaker not found" });
        res.json(speaker);
    } catch (err) {
        console.error("Error fetching speaker:", err);
        res.status(500).json({ message: err.message });
    }
});



export default SpeakerRouter;