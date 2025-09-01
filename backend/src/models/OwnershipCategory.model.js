import mongoose from "mongoose";

const OwnershipCategorySchema = new mongoose.Schema({
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

const OwnershipCategorymodel = mongoose.model("OwnershipCategory", OwnershipCategorySchema);

export default OwnershipCategorymodel;
