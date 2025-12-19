import mongoose from "mongoose";
import slugify from "slugify";
import crypto from "crypto";
const UserSchema = new mongoose.Schema({
  name: {
    type: String
  },

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    // unique: true,
    required: true
  },
  password: {
    type: String,

  },
  
  phone: { type: String},


  profilePicture: {
    type: String, // Store file path or URL
    default: ""
  },
  des: {
    type: String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  Approved: {
    type: String,
    enum: ["Approved", "pending", "Rejected"],
    default: "pending"
  },
  type: {
    type: String
  },


  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },


  // Optional role label string
  // role: {
  //   type: String,
  //     enum: ["seeker", "employer", "superadmin"],
  //     default:"seeker"
  // },

  // Reference to role document
  roleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },

  slug: { type: String, unique: true, sparse: true },

});


// UserSchema.pre("save", function (next) {
//   this.name = `${this.firstName} ${this.lastName}`;
//   next();
// });

UserSchema.pre("save", async function (next) {
  this.name = `${this.firstName} ${this.lastName}`;

  if (this.type === "mentor" && !this.slug) {
    const baseSlug = slugify(`${this.firstName}-${this.lastName}`, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let isExists = await mongoose.models.User.findOne({ slug });

    while (isExists) {
      // generate 4 random characters
      const randomStr = crypto.randomBytes(2).toString("hex"); // ex: a9f3
      slug = `${baseSlug}-${randomStr}`;
      isExists = await mongoose.models.User.findOne({ slug });
    }

    this.slug = slug;
  }

  next();
});


const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
