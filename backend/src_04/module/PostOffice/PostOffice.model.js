import mongoose from "mongoose";

const postOfficeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  officename: { type: String, required: true },
  pincode: { type: String, required: true },
  divisionname: { type: String },
  regionname: { type: String },
  circlename: { type: String },
  Taluk: { type: String },
  Districtname: { type: String },
  statename: { type: String },
  RelatedSuboffice: { type: String },
  RelatedHeadoffice: { type: String },
}, { timestamps: true });

const PostOfficeModel= mongoose.model("post_office", postOfficeSchema);
export default PostOfficeModel;