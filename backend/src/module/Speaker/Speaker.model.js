

import mongoose from 'mongoose';
import slugify from "slugify";

const SpeakerSchema = mongoose.Schema({
    salutation: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: Number,
    country: { ref: 'Country', type: Number, required: true },
    state: { ref: 'State', type: Number, required: true },
    city: { ref: 'City', type: Number, required: true },
    introduction: String,
    description: String,
    profilePic: String,
    qualification: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    slug: { type: String, unique: true },
}, { timestamps: true });

// Slug generate before save
SpeakerSchema.pre("save", function (next) {
  if (this.firstName || this.lastName) {
    this.slug = slugify(`${this.firstName} ${this.lastName}`, { lower: true, strict: true });
  }
  next();
});

const SpeakerModel = mongoose.model('Speaker', SpeakerSchema)

export default SpeakerModel;