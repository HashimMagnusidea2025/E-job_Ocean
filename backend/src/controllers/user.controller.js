import UserModel from "../models/user.model.js";

import bcrypt from 'bcrypt'


export const createUser = async (req, res) => {

  try {
    const { name, email, password, confirmPassword, roleID } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password: hashedPassword,  roleID });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getUsers = async (req, res) => {

  try {
    // if (!req.user.user ||  req.user.roleID.name !== "superadmin") {
    //   return res.status(403).json({ message: "Access denied: Superadmin only" });
    // }
    
     const users = await UserModel.find().populate({
      path: "roleID",
      populate: { path: "permissions" }
    });

    
     const filteredUsers = users.filter(
      (user) => user.roleID?.name?.toLowerCase() !== "superadmin"
    );
    

    res.json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// export const getAllUsers = async (req, res) => {
//   const users = await UserModel.find().populate("Role");
//   res.json(users);
// };


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, roleID, password, newPassword } = req.body;

    // Find the user first
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update data
    const updateData = { firstName, lastName, email, roleID };

    // Handle password update if provided
    if (password && newPassword) {
      // Verify current password first
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select('-password'); // Exclude password from the returned data

    res.json(updatedUser);
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};





export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({ email }).populate({
      path: "roleID",
      populate: { path: "permissions" }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

