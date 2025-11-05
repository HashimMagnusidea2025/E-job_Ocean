import express from "express";
import { protect } from "../middleware/auth.Middleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import multer from 'multer';
import path from 'path';
import UserModel from "../models/user.model.js";
import {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
 getFreeUsers,
 getAllActiveMentors,
 getMentorsWithSessions,
 getActiveMentorsWithSessions,
  getMentorByIdWithSessions,
  getUserById
} from "../controllers/user.controller.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profilePictures");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", createUser);
// Optional: If `getUsers` is a filtered/limited version, or remove one
router.get("/",   getUsers);
router.get('/email',getUserByEmail)

// Create a new user (optional route)
// GET /users/:id


router.get('/free-users', getFreeUsers)

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



router.put("/:id",upload.single("profilePicture"), updateUser);

// Delete user by ID
router.delete("/:id",  deleteUser);

router.get('/mentors/all', getAllActiveMentors);
router.get('/mentors/with-sessions', getMentorsWithSessions);
router.get('/mentors/active', getActiveMentorsWithSessions);
router.get('/mentors/:id', getMentorByIdWithSessions);
router.get("/:id", getUserById); // Add general user by ID route

export default router;
