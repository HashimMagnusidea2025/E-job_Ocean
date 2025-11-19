import JobAlertsModel from './JobAlerts.model.js';
import mongoose from 'mongoose';

export const createJobAlert = async (req, res) => {
    try {
        const {
            jobTitle,
            skills,
            country,
            state,
            city,
            careerLevel,
            functionalArea,
            experience,
            mode,
        } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ message: "Job Title is required" })
        }

        // Convert string IDs to ObjectId if they exist
        const newAlertData = {
            userId: req.user._id,
            jobTitle,
            country: Number(country),
            state: Number(state),
            city: Number(city),
            experience,
            mode
        };

        // Handle skills array
        if (skills && Array.isArray(skills)) {
            newAlertData.skills = skills.filter(skill => mongoose.Types.ObjectId.isValid(skill))
                .map(skill => new mongoose.Types.ObjectId(skill));
        }

        // Only add these fields if they exist and are valid
        if (careerLevel && mongoose.Types.ObjectId.isValid(careerLevel)) {
            newAlertData.careerLevel = new mongoose.Types.ObjectId(careerLevel);
        }
        if (functionalArea && mongoose.Types.ObjectId.isValid(functionalArea)) {
            newAlertData.functionalArea = new mongoose.Types.ObjectId(functionalArea);
        }

        const newAlert = await JobAlertsModel.create(newAlertData);

        return res.status(201).json({
            success: true,
            message: "Job Alert Created successfully",
            data: newAlert
        });
    } catch (error) {
        console.error("Error creating job alert:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create job alert",
            error: error.message,
        });
    }
}

export const getMyJobAlert = async (req, res) => {
    try {
        const alerts = await JobAlertsModel.find({ userId: req.user._id })
            .populate({
                path: "skills",
                select: "skillName",
                model: "buildSkills"
            })
            .populate("careerLevel", "name")
            .populate("functionalArea", "name")
            .sort({ createdAt: -1 });
        // Debug log to see what's actually being returned
       
        res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        console.error("Error fetching alerts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts",
            error: error.message,
        });
    }
}




// Delete alert
export const deleteJobAlert = async (req, res) => {
    try {
        const alert = await JobAlertsModel.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!alert) {
            return res.status(404).json({ message: "Job alert not found" });
        }

        await alert.deleteOne();
        res.status(200).json({ success: true, message: "Alert deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed", error: error.message });
    }
};