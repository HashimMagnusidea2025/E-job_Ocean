import mongoose from "mongoose";

const NoofEmployeesCategorySchema = new mongoose.Schema({
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

const NoofEmployeesCategorymodel = mongoose.model("NoofEmployeesCategory", NoofEmployeesCategorySchema);

export default NoofEmployeesCategorymodel;
