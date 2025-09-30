

import mongoose  from "mongoose";

const CMSPageSchema = mongoose.Schema({

     name: { type: String, unique: true },
     status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
});

const CMSPageModel = mongoose.model('CMSPage', CMSPageSchema);

export default CMSPageModel;
