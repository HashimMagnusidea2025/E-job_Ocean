import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
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
    required: true
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

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
