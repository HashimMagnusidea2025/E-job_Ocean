import mongoose from "mongoose";

const FoundedYearCategorySchema = new mongoose.Schema({
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

const FoundedYearCategorymodel = mongoose.model("FoundedYearCategory", FoundedYearCategorySchema);

export default FoundedYearCategorymodel;
