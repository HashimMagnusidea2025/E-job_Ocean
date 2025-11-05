import mongoose from "mongoose";

const DegreeLevelCategorySchema = new mongoose.Schema({
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

const DegreeLevelCategoryModel = mongoose.model("DegreeLevelCategory", DegreeLevelCategorySchema);

export default DegreeLevelCategoryModel;
