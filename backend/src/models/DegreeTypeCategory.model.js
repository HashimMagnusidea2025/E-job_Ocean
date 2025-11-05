import mongoose from "mongoose";

const DegreeTypeCategorySchema = new mongoose.Schema({
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

const DegreeTypeCategoryModel = mongoose.model("DegreeTypeCategory", DegreeTypeCategorySchema);

export default DegreeTypeCategoryModel;
