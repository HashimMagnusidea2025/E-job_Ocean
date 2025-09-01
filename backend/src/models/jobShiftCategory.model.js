import mongoose from "mongoose";

const jobShiftCategorySchema = new mongoose.Schema({
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

const jobShiftCategoryModel = mongoose.model("jobShiftCategory", jobShiftCategorySchema);

export default jobShiftCategoryModel;
