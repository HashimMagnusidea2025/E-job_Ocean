import UserModel from "../models/user.model.js";


import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

class AuthController {
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword,role, roleID} = req.body;

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      };

      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }


      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);


      // Create new user
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        roleID,

      });

      res.status(201).json({
        message: "User created",
        token: generateToken(user._id),
        user
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await UserModel.findOne({ email }).populate({
        path: "roleID",
        populate: { path: "permissions" }
      });

      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

      const token = generateToken(user._id);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }



  static async getMe(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

}

export default AuthController;
