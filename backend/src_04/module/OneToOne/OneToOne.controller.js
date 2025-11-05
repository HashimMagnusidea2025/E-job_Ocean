import OneToOneModel from "./OneToOne.model.js";

export const CreateOneToOne = async (req, res) => {

    try {
        console.log("Request User:", req.user); // Debug log
        console.log("Request Body:", req.body); // Debug log

        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const user = req.user;

        let sessionData = { ...req.body };

        const userRole = user.roleID?.name;
        // Determine who is creating the session
        if (userRole === "Mentor") {
            sessionData.Mentor = user._id;
            sessionData.createdBy = "mentor";
            sessionData.Speaker = null; // Mentor के लिए Speaker null
        } else if (userRole === "superadmin") {
            sessionData.createdBy = "superadmin";
            sessionData.Mentor = null; // Admin के लिए Mentor null
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        const newSession = await OneToOneModel.create(sessionData);
        res.status(201).json(newSession);


    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const GetOneToOne = async (req, res) => {
    try {

        const sessions = await OneToOneModel.find()
            .populate('Speaker')
            .populate('Mentor');
        res.json(sessions);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const GetOneToOneById = async (req, res) => {

    try {
        const { id } = req.params;
        const session = await OneToOneModel.findById(id)
            .populate("Speaker")
            .populate("Mentor");
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
        })
            .populate('Speaker')


        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get sessions by Mentor
export const GetOneToOneByMentor = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const sessions = await OneToOneModel.find({
            Mentor: mentorId,
            status: 'active'
        }).populate('Mentor');

        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get sessions for current mentor (for their dashboard)
export const GetMyMentorSessions = async (req, res) => {
    try {
         if (!req.user || req.user.roleID?.name !== "Mentor") {
            return res.status(403).json({ message: "Access denied" });
        }

        const sessions = await OneToOneModel.find({
            Mentor: req.user._id
        }).populate('Mentor').sort({ createdAt: -1 });

        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const updateOneToOne = async (req, res) => {

    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const session = await OneToOneModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

             const userRole = user.roleID?.name;
       // Authorization check
        if (userRole === "Mentor") {
            if (session.Mentor.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "You can only edit your own sessions" });
            }
            
            // Mentors can't change certain fields
            const allowedFields = ['selectDays', 'selectDate', 'courseTitle', 'courseDescription', 
                                 'fees', 'courseType', 'paymentType', 'includingGST', 
                                 'startTime', 'endTime', 'status'];
            
            Object.keys(req.body).forEach(key => {
                if (!allowedFields.includes(key)) {
                    delete req.body[key];
                }
            });
        }

        const updatedSession = await OneToOneModel.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};



export const DeleteOneToOne = async (req, res) => {


    try {
        const { id } = req.params;
        const user = req.user;

         
        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const session = await OneToOneModel.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const userRole = user.roleID?.name;

        // Authorization check
        if (userRole === "Mentor" && session.Mentor.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own sessions" });
        }

        await OneToOneModel.findByIdAndDelete(id);
        res.json({ message: "Session deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}