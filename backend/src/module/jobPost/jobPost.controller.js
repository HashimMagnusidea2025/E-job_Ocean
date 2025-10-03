import JobPostModel from "./jobPost.model.js";

// Create Job Post
export const createJobPost = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const newJob = new JobPostModel({
      ...req.body,
      file_attach: filePath,
    });

    await newJob.save();
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get all Job Posts with skill names
export const getAllJobPosts = async (req, res) => {
  try {
    const jobs = await JobPostModel.find()
      .populate("skills", "name")  // populate skills with only the 'name' field
      .populate("careerLevel", "name")
      .populate("functionalArea", "name")
      .populate("jobType", "name")
      .populate("jobShift", "name");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single Job Post with skill names
export const getJobPost = async (req, res) => {
  try {
    const job = await JobPostModel.findById(req.params.id)
      .populate("skills", "name")
      .populate("careerLevel", "name")
      .populate("functionalArea", "name")
      .populate("jobType", "name")
      .populate("jobShift", "name");

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Get all Job Posts
// export const getAllJobPosts = async (req, res) => {
//   try {
//     const jobs = await JobPostModel.find();
//     res.json(jobs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get single Job Post
// export const getJobPost = async (req, res) => {
//   try {
//     const job = await JobPostModel.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     res.json(job);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Update Job Post
export const updateJobPost = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : undefined;
    const updatedData = { ...req.body };
    if (filePath) updatedData.file_attach = filePath;

    const job = await JobPostModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Job Post

export const deleteJobPost = async (req, res) => {
  try {
    const job = await JobPostModel.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
