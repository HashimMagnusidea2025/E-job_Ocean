import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createMeetOurTeam,
  getMeetOurTeam,
  updateTeam,
  getAllMeetOurTeam,
  deleteMeetOurTeam,
} from "../meetaourteam/meetourteam.controller.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/teams");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

const MeetOurTeamrouter = express.Router();

MeetOurTeamrouter.post(
  "/",
  upload.single("image"),
  createMeetOurTeam
);
MeetOurTeamrouter.get("/", getAllMeetOurTeam)
MeetOurTeamrouter.get("/status", getMeetOurTeam);

MeetOurTeamrouter.put("/:id", upload.single("image"), updateTeam);
MeetOurTeamrouter.delete("/:id", deleteMeetOurTeam);

export default MeetOurTeamrouter;
