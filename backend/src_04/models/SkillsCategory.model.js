import mongoose from "mongoose";

const SkillsCategorySchema = new mongoose.Schema({
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

const SkillsCategoryModel = mongoose.model("SkillsCategory", SkillsCategorySchema);

export default SkillsCategoryModel;
