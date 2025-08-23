import express from "express";
import { protect } from "../middleware/auth.Middleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import UserModel from "../models/user.model.js";
import {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";


const router = express.Router();

router.post("/", createUser);
// Optional: If `getUsers` is a filtered/limited version, or remove one
router.get("/",   getUsers);
router.get('/email',getUserByEmail)

// Create a new user (optional route)
// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log(user);
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// change 8-7
router.put("/:id", updateUser);

// Delete user by ID
router.delete("/:id",  deleteUser);

export default router;
