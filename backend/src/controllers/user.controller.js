// controllers/user.controller.js
import UserModel from "../models/user.model.js";
import CompanyInformationModel from "../models/CompanyInformation.model.js";
import bcrypt from "bcrypt";


export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, roleID, status } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Relaxed regex (letter, number, special char)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least 1 letter, 1 number, and 1 special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleID,
      status: status || "active",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate({
      path: "roleID",
      populate: { path: "permissions" },
    });
     
    

    const filteredUsers = users.filter(
      (user) =>
        user.roleID?.name?.toLowerCase() !== "superadmin" 
       
    );

    res.json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, roleID, password, newPassword, status } = req.body;

    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updateData = {
      firstName,
      lastName,
      email,
      roleID,
      status,
      name: `${firstName} ${lastName}`,
    };

    // If user is changing password
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Check password length
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }

      // Regex for complexity
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message:
            "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select(
      "-password"
    );

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
      populate: { path: "permissions" },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getFreeUsers = async (req, res) => {
  try {
    // sab users fetch karo with role populate
    const users = await UserModel.find().populate("roleID");

    // company ke andar jo users already linked hai
    const companies = await CompanyInformationModel.find({}, "user");
    const usedUserIds = companies.map((c) => c.user.toString());

    // filter only those who are not superadmin and not in company
    const filteredUsers = users.filter(
      (user) =>
        user.roleID?.name !== "superadmin" &&
        !usedUserIds.includes(user._id.toString())
    );

    res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
