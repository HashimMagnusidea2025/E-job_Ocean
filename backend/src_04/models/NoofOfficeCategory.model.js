import mongoose from "mongoose";

const NoofOfficeCategorySchema = new mongoose.Schema({
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

const NoofOfficeCategorymodel = mongoose.model("NoofOfficeCategory", NoofOfficeCategorySchema);

export default NoofOfficeCategorymodel;
