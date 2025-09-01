import mongoose from "mongoose";



const RoleSchma = mongoose.Schema({

    name: { type: String, required: true, unique: true },

    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }],
    status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
})



const roleModel = mongoose.model('Role', RoleSchma);

export default roleModel;
