import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  name:{
    type:String
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
    unique: true,
    required: true
  },
  password: {
    type: String,
    
  },
  phone: { type: String },
  
  profilePicture: {
    type: String, // Store file path or URL
    default: ""
  },
  des:{
    type:String
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

   Approved:{
     type: String,
    enum:["Approved","pending","Rejected"],
    default: "pending"
  },
  type:{
    type:String
  },
  



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

});
UserSchema.pre("save", function (next) {
  this.name = `${this.firstName} ${this.lastName}`;
  next();
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
