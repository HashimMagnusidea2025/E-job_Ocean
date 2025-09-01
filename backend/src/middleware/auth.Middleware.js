import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import dotenv from 'dotenv';

dotenv.config();
 export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate({
      path: "roleID",
      populate: { path: "permissions" },
        
    });
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
