import mongoose from "mongoose";

const CareerLevelCategorySchema = new mongoose.Schema({
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

const CareerLevelCategoryModel = mongoose.model("CareerLevelCategory", CareerLevelCategorySchema);

export default CareerLevelCategoryModel;
