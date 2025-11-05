

import mongoose  from "mongoose";

const permissionsSchema = mongoose.Schema({

     name: { type: String, unique: true },
     status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
});

const permissionsModel = mongoose.model('permissions', permissionsSchema);

export default permissionsModel;
