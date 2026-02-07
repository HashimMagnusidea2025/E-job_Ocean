import MeetOurTeamModel from "./meetourteam.model.js";
import fs from "fs";


/* ✅ CREATE */
// export const createMeetOurTeam = async (req, res) => {
//   try {
//     const { name, text } = req.body;
//     const image = req.file?.filename;

//     if (!name || !text || !image) {
//       return res.status(400).json({
//         message: "Name, text and image are required",
//       });
//     }

//     const data = await MeetOurTeamModel.create({
//       name,
//       text,
//       image,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Team member added successfully",
//       data,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// UPDATE

export const createMeetOurTeam = async (req, res) => {
  try {
    const { name, text, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = `/uploads/teams/${req.file.filename}`;

    const data = await MeetOurTeamModel.create({
      name,
      text,
      image,
      status: status || "active", // default active
    });

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const updateTeam = async (req, res) => {
  try {
    const team = await MeetOurTeamModel.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Not found" });

    if (req.file && fs.existsSync(`.${team.image}`)) {
      fs.unlinkSync(`.${team.image}`);
      team.image = `/uploads/teams/${req.file.filename}`;
    }

    team.name = req.body.name;
    team.text = req.body.text;
    team.status = req.body.status || team.status; // ✅ update status

    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ✅ GET ALL (Frontend Slider) */
export const getMeetOurTeam = async (req, res) => {
  try {
    const data = await MeetOurTeamModel.find({ status: "active" })
     

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};
// Admin - get all members regardless of status
export const getAllMeetOurTeam = async (req, res) => {
  try {
    const data = await MeetOurTeamModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

/* ✅ DELETE */
export const deleteMeetOurTeam = async (req, res) => {
  try {
    const { id } = req.params;

    await MeetOurTeamModel.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
