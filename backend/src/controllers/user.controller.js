// controllers/user.controller.js
import UserModel from "../models/user.model.js";
import CompanyInformationModel from "../models/CompanyInformation.model.js";
import bcrypt from "bcrypt";

import OneToOneModel from "../module/OneToOne/OneToOne.model.js";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, roleID, status, des } = req.body;

    console.log(phone);
    console.log("📩 Full req.body at backend:", req.body);


    console.log("Register body:", req.body); // 👈 Check phone here
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
      phone,
      password: hashedPassword,
      roleID,
      status: status || "active",
      des: null
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
    const { firstName, lastName, email, roleID, phone, password, newPassword, status, des } = req.body;

    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updateData = {
      firstName,
      lastName,
      phone,
      email,
      roleID,
      status,
      name: `${firstName} ${lastName}`,
      des
    };

    if (req.file) {
      updateData.profilePicture = `/uploads/profilePictures/${req.file.filename}`;
    }

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




// User.controller.js में नया function add करें
export const getActiveMentorsWithSessions = async (req, res) => {
  try {
    console.log("Fetching active mentors with sessions...");

    const mentors = await UserModel.find({
      status: 'active',
      Approved: 'Approved'
    })
      .populate('roleID')
      .select('-password');

    const filteredMentors = mentors.filter(m => m.roleID?.name === 'Mentor');
    console.log("Found mentors:", filteredMentors.length);

    // Mentors के sessions fetch करें
    const mentorsWithSessions = await Promise.all(
      mentors.map(async (mentor) => {
        try {
          const sessions = await OneToOneModel.find({
            Mentor: mentor._id,
            status: 'active'
          });

          return {
            _id: mentor._id,
            firstName: mentor.firstName,
            lastName: mentor.lastName,
            email: mentor.email,
            phone: mentor.phone,
            profilePicture: mentor.profilePicture,
            bio: mentor.bio,
            expertise: mentor.expertise,
            qualification: mentor.qualification,
            experience: mentor.experience,
            linkedin: mentor.linkedin,
            sessionCount: sessions.length,
            hasActiveSessions: sessions.length > 0,
            sessions: sessions
          };
        } catch (error) {
          console.error(`Error fetching sessions for mentor ${mentor._id}:`, error);
          return {
            ...mentor.toObject(),
            sessionCount: 0,
            hasActiveSessions: false,
            sessions: []
          };
        }
      })
    );

    // Only those mentors जिनके active sessions हैं
    const activeMentors = mentorsWithSessions.filter(mentor => mentor.hasActiveSessions);

    console.log("Active mentors with sessions:", activeMentors.length);
    res.json(activeMentors);
  } catch (err) {
    console.error("Error in getActiveMentorsWithSessions:", err);
    res.status(500).json({ message: "Error fetching active mentors", error: err.message });
  }
};



// User.controller.js में
export const getMentorByIdWithSessions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching mentor by ID:", id);

    const mentor = await UserModel.findById(id)
      .select('-password')
      .populate('roleID')


    if (!mentor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is actually a mentor
    if (mentor.roleID?.name !== 'Mentor') {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Mentor के active sessions fetch करें
    const sessions = await OneToOneModel.find({
      Mentor: mentor._id,
      status: 'active'
    });

    const mentorWithSessions = {
      _id: mentor._id,
      firstName: mentor.firstName,
      lastName: mentor.lastName,
      email: mentor.email,
      phone: mentor.phone,
      profilePicture: mentor.profilePicture,
      bio: mentor.bio,
      expertise: mentor.expertise,
      qualification: mentor.qualification,
      experience: mentor.experience,
      linkedin: mentor.linkedin,
      sessions: sessions
    };

    res.json(mentorWithSessions);
  } catch (err) {
    console.error("Error fetching mentor:", err);
    res.status(500).json({ message: err.message });
  }
};


// User.controller.js में
export const getAllActiveMentors = async (req, res) => {
  try {
    console.log("Fetching all active mentors...");

    // सिर्फ active और approved mentors fetch करें
    const mentors = await UserModel.find({
      status: 'active',
      Approved: 'Approved'
    })
      .populate('roleID')
      .select('-password');

    // सिर्फ Mentor role वाले users filter करें
    const mentorUsers = mentors.filter(m => m.roleID?.name === 'Mentor');

    console.log("Found mentor users:", mentorUsers.length);
    res.json(mentorUsers);
  } catch (err) {
    console.error("Error in getAllActiveMentors:", err);
    res.status(500).json({ message: "Error fetching mentors", error: err.message });
  }
};

// सिर्फ mentors with sessions के लिए
export const getMentorsWithSessions = async (req, res) => {
  try {
    console.log("Fetching mentors with sessions...");

    // सिर्फ active और approved mentors fetch करें
    const mentors = await UserModel.find({
      status: 'active',
      Approved: 'Approved'
    })
      .populate('roleID')
      .select('-password');

    // सिर्फ Mentor role वाले users filter करें
    const mentorUsers = mentors.filter(m => m.roleID?.name === 'Mentor');

    // Mentors के sessions fetch करें
    const mentorsWithSessions = await Promise.all(
      mentorUsers.map(async (mentor) => {
        try {
          const sessions = await OneToOneModel.find({
            Mentor: mentor._id,
            status: 'active'
          });

          return {
            _id: mentor._id,
            firstName: mentor.firstName,
            lastName: mentor.lastName,
            email: mentor.email,
            phone: mentor.phone,
            profilePicture: mentor.profilePicture,
            bio: mentor.bio,
            expertise: mentor.expertise,
            qualification: mentor.qualification,
            experience: mentor.experience,
            linkedin: mentor.linkedin,
            sessions: sessions,
            sessionCount: sessions.length
          };
        } catch (error) {
          console.error(`Error fetching sessions for mentor ${mentor._id}:`, error);
          return {
            ...mentor.toObject(),
            sessions: [],
            sessionCount: 0
          };
        }
      })
    );

    console.log("Mentors with sessions:", mentorsWithSessions.length);
    res.json(mentorsWithSessions);
  } catch (err) {
    console.error("Error in getMentorsWithSessions:", err);
    res.status(500).json({ message: "Error fetching mentors with sessions", error: err.message });
  }
};

// Alternative: Simple user by ID (agar mentor specific API kaam na kare)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id)
      .populate('roleID')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



