import mongoose from "mongoose";

const FunctionalAreaCategorySchema = new mongoose.Schema({
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

const FunctionalAreaCategoryModel = mongoose.model("FunctionalAreaCategory", FunctionalAreaCategorySchema);

export default FunctionalAreaCategoryModel;
