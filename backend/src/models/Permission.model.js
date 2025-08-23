

import mongoose  from "mongoose";

const permissionsSchema = mongoose.Schema({

     name: { type: String, unique: true },
});

const permissionsModel = mongoose.model('permissions', permissionsSchema);

export default permissionsModel;
