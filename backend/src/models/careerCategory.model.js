import mongoose from "mongoose";

const CareerCategorySchema = new mongoose.Schema({
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

const CareerCategoryModel = mongoose.model("CareerCategory", CareerCategorySchema);

export default CareerCategoryModel;
