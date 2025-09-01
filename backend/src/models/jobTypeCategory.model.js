import mongoose from "mongoose";

const jobTypeCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

const jobTypeCategoryModel = mongoose.model("jobTypeCategory", jobTypeCategorySchema);

export default jobTypeCategoryModel;
