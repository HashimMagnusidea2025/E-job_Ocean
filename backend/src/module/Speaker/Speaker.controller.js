import SpeakerModel from "./Speaker.model.js";
import {slugify} from './../../utils/slugify.js';

export const CreateSpeaker = async (req, res) => {
    try {
        const {
            salutation,
            firstName,
            lastName,
            email,
            phone,
            country,
            state,
            city,
            introduction,
            description,
            qualification
        } = req.body;
  const slug = slugify(`${firstName} ${lastName}`);
        // yaha object banaya
        const speakerData = {
            salutation,
            firstName,
            lastName,
            email,
            phone,
            country,
            state,
            city,
            introduction,
            description,
            qualification,
             slug,
        };

        // agar file ayi hai to profilePic set karo
        if (req.file) {
            speakerData.profilePic = `uploads/speakers/${req.file.filename}`;

        }

        const speaker = await SpeakerModel.create(speakerData);
        res.status(201).json(speaker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



export const getSpeakers = async (req, res) => {

    try {

        const speakers = await SpeakerModel.find()

        res.json(speakers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const getSpeakerByIdsafe = async (req, res) => {

    try {

        const speaker = await SpeakerModel.findById(req.params.id)

        if (!speaker) return res.status(404).json({ message: "Speaker not found" })
        res.json(speaker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getSpeakerById = async (req, res) => {

    try {

        const speaker = await SpeakerModel.findById(req.params.id)
            .populate("country")
            .populate("state")
            .populate("city");
        if (!speaker) return res.status(404).json({ message: "Speaker not found" })
        res.json(speaker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateSpeaker = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.profilePic = `uploads/Speakers/${req.file.filename}`;

        }

        const speaker = await SpeakerModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!speaker) return res.status(404).json({ message: "Speaker not found" });

        res.json(speaker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const deleteSpeaker = async (req, res) => {

    try {
        const speaker = await SpeakerModel.findByIdAndDelete(req.params.id);
        if (!speaker) return res.status(404).json({ message: "Speaker not found" });
        res.json({ message: "Speaker deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}




export const getActiveSpeakers = async (req, res) => {
    try {
        const speakers = await SpeakerModel.find({ status: "active" });

        console.log("Active Speakers Fetched:", speakers);
        res.json(speakers);
    } catch (err) {
        console.error("Error in getActiveSpeakers:", err);
        res.status(500).json({ message: "Error fetching active speakers", error: err.message });
    }
};


export const getSpeakerBySlug = async (req, res) => {
  try {
    console.log("Fetching speaker with slug:", req.params.slug);
    const speaker = await SpeakerModel.findOne({ slug: req.params.slug });
    console.log("Speaker found:", speaker);
    if (!speaker) return res.status(404).json({ message: "Speaker not found" });
    res.json(speaker);
  } catch (err) {
    console.error("Error fetching speaker:", err);
    res.status(500).json({ message: err.message });
  }
};



