import OneToOneModel from "./OneToOne.model.js";

export const CreateOneToOne = async (req, res) => {

    try {

        const newSession = await OneToOneModel.create(req.body);
        res.status(201).json(newSession);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const GetOneToOne = async (req, res) => {
    try {

        const sessions = await OneToOneModel.find().populate('Speaker');
        res.json(sessions);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const GetOneToOneById = async (req, res) => {

    try {
        const { id } = req.params;
        const session = await OneToOneModel.findById(id).populate("Speaker");
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.json(session)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const GetOneToOneBySpeaker = async (req, res) => {
    try {
        const { speakerId } = req.params;
        const sessions = await OneToOneModel.find({
            Speaker: speakerId,
            status: 'active'
        }).populate('Speaker');

        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateOneToOne = async (req, res) => {

    try {
        const { id } = req.params;
        const updatedSession = await OneToOneModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



export const DeleteOneToOne = async (req, res) => {


    try {
        const { id } = req.params;
        await OneToOneModel.findByIdAndDelete(id);
        res.json({ message: "Session deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}