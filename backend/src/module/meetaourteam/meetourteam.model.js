import mongoose from "mongoose";

const MeetOurTeamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        text: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true, // filename
        },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

const MeetOurTeamModel = mongoose.model(
    "MeetOurTeam",
    MeetOurTeamSchema
);

export default MeetOurTeamModel;
