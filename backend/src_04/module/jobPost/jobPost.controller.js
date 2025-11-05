import JobPostModel from "./jobPost.model.js";


// Create Job Post
export const createJobPost = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;

    const userId = req.user?._id;
    // ✅ Validate companyId
    if (!req.body.companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required"
      });
    }
    const newJob = new JobPostModel({
      ...req.body,
      postedBy: userId,
      postedByType: req.body.postedByType || "Employer",

      file_attach: filePath,
      companyId: req.body.companyId
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
      .populate("jobShift", "name")
      .populate("postedBy", "name email")
      .populate("companyId")

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
      .populate("jobShift", "name")
      .populate("postedBy", "name email")
      .populate("companyId", "company.name company.employerLogo company.industry")


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



// Get all Active Job Posts with populated fields
export const getAllActiveJobPosts = async (req, res) => {
  try {
    const jobs = await JobPostModel.find({ isActive: true })
      .populate("skills", "name")
      .populate("careerLevel", "name")
      .populate("functionalArea", "name")
      .populate("jobType", "name")
      .populate("jobShift", "name")
      .populate("postedBy", "name email")
      .populate("companyId", "company.name company.employerLogo company.industry")

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching active job posts:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get jobs by specific employer
export const getEmployerJobs = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware

    const jobs = await JobPostModel.find({
      postedBy: userId,
      postedByType: "Employer"
    })
      .populate("skills", "name")
      .populate("careerLevel", "name")
      .populate("functionalArea", "name")
      .populate("jobType", "name")
      .populate("jobShift", "name")
      .populate("postedBy", "name email")
      .populate("companyId", "company.name company.employerLogo company.industry")
      

      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching employer jobs:", err);
    res.status(500).json({ message: err.message });
  }
};



// Toggle Job Active Status
export const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the job first
    const job = await JobPostModel.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Check if user owns this job (optional security measure)
    const userId = req.user?._id;
    if (job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job"
      });
    }

    // Toggle the isActive status
    const updatedJob = await JobPostModel.findByIdAndUpdate(
      id,
      { isActive: !job.isActive },
      { new: true }
    )
    .populate("skills", "name")
    .populate("careerLevel", "name")
    .populate("functionalArea", "name")
    .populate("jobType", "name")
    .populate("jobShift", "name")
    .populate("postedBy", "name email")
    .populate("companyId", "company.name company.employerLogo company.industry");

    res.status(200).json({
      success: true,
      message: `Job ${updatedJob.isActive ? 'activated' : 'deactivated'} successfully`,
      job: updatedJob
    });

  } catch (err) {
    console.error("Error toggling job status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: err.message
    });
  }
};
