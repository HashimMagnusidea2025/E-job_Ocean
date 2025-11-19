import { Education, Experience,Skills,Language } from "./BuildResume.model.js";

import mongoose from "mongoose";





// ✅ Create new experience
// export const createExperience = async (req, res) => {
//     try {
//         const {
//             jobTitle,
//             companyName,
//             country,
//             state,
//             city,
//             startDate,
//             endDate,
//             currentlyWorking,
//             description,
//         } = req.body;

//         // Validation
//         if (!jobTitle || !companyName || !country || !state || !city || !startDate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All required fields must be provided",
//             });
//         }

//         // Debug: Check if user is available in request
//         console.log("User from request:", req.user);

//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not authenticated",
//             });
//         }

//         const experience = new Experience({
//             userId: req.user._id, // Changed from user to userId
//             jobTitle,
//             companyName,
//             country,
//             state,
//             city,
//             startDate,
//             endDate: currentlyWorking ? null : endDate,
//             currentlyWorking,
//             description,
//         });

//         await experience.save();

//         res.status(201).json({
//             success: true,
//             message: "Experience added successfully",
//             data: experience,
//         });
//     } catch (error) {
//         console.error("❌ Create Experience Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

// ✅ Create new experience
export const createExperience = async (req, res) => {
    try {
        const {
            jobTitle,
            companyName,
            country,
            state,
            city,
            startDate,
            endDate,
            currentlyWorking,
            description,
        } = req.body;

        console.log("📝 Received experience data:", req.body);

        // Validation
        if (!jobTitle || !companyName || !country || !state || !city || !startDate) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const experience = new Experience({
            userId: req.user._id,
            jobTitle,
            companyName,
            country,  // ✅ Store as top-level field
            state,    // ✅ Store as top-level field
            city,     // ✅ Store as top-level field
            startDate,
            endDate: currentlyWorking ? null : endDate,
            currentlyWorking,
            description,
        });

        await experience.save();
        console.log("💾 Experience saved to database:", experience);

        res.status(201).json({
            success: true,
            message: "Experience added successfully",
            data: experience,
        });
    } catch (error) {
        console.error("❌ Create Experience Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Get all experiences for a user
export const getUserExperiences = async (req, res) => {
    try {


        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const experiences = await Experience.find({
            userId: req.user._id, // Changed from user to userId
          
        })
        .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            data: experiences,
        });
    } catch (error) {
        console.error("❌ Get Experiences Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const toggleExperienceStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const experience = await Experience.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!experience) {
            return res.status(404).json({ 
                success: false, 
                message: 'Experience not found' 
            });
        }

        // Toggle isActive status
        experience.isActive = !experience.isActive;
        await experience.save();

        res.status(200).json({ 
            success: true, 
            data: experience,
            message: `Experience ${experience.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error("❌ Error toggling experience status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all experiences for a user - UPDATED WITH POPULATION
// export const getUserExperiences = async (req, res) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not authenticated",
//             });
//         }

//         const experiences = await Experience.find({
//             userId: req.user._id,
//             isActive: true,
//         })
//             .populate('country', 'name')  // ✅ Populate country name
//             .populate('state', 'name')    // ✅ Populate state name
//             .populate('city', 'name')     // ✅ Populate city name
//             .sort({ startDate: -1 });

//         console.log("📤 Sending experiences:", experiences);

//         res.status(200).json({
//             success: true,
//             data: experiences,
//         });
//     } catch (error) {
//         console.error("❌ Get Experiences Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: error.message,
//         });
//     }
// };

// ✅ Get single experience by ID
export const getExperienceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const experience = await Experience.findOne({
            _id: id,
            userId: req.user._id, // Changed from user to userId
            isActive: true,
        });

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        res.status(200).json({
            success: true,
            data: experience,
        });
    } catch (error) {
        console.error("❌ Get Experience Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Update experience
export const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const experience = await Experience.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id, // Changed from user to userId
                isActive: true,
            },
            updateData,
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: experience,
        });
    } catch (error) {
        console.error("❌ Update Experience Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Delete experience (soft delete)
export const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid experience ID",
            });
        }


        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const experience = await Experience.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id, // Changed from user to userId
                isActive: true,
            },
            { isActive: false },
            { new: true }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience deleted successfully",
        });
    } catch (error) {
        console.error("❌ Delete Experience Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// ✅ Create new education
export const createEducation = async (req, res) => {
    try {
        const {
            degreeLevel,
            degreeType,
            customDegreeType,
            degreeTitle,
            country,    
            state,
            city,
            yearOfCompletion,
            institute,
        } = req.body;

        let degreeTypeToSave = null;

          // अगर custom degree type है
        if (degreeType === "other" && customDegreeType) {
            degreeTypeToSave = null; // या आप new degree type create कर सकते हैं
            // customDegreeType field में store करें
        } else {
            degreeTypeToSave = degreeType;
        }

        // Validation
        if (!degreeLevel ||  !degreeTitle || !country || !state || !city || !yearOfCompletion) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Debug: Check if user is available in request
        console.log("User from request:", req.user);

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const education = new Education({
            userId: req.user._id, // Changed from user to userId
            degreeLevel,
            degreeType: degreeTypeToSave,
            customDegreeType: degreeType === "other" ? customDegreeType : null,
            degreeTitle,
            country,
            state,
            city,
            yearOfCompletion,
            institute,
        });

        await education.save();

        // Populate references for response
        await education.populate("degreeLevel degreeType");

        res.status(201).json({
            success: true,
            message: "Education added successfully",
            data: education,
        });
    } catch (error) {
        console.error("❌ Create Education Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Get all educations for a user
export const getUserEducations = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const educations = await Education.find({
            userId: req.user._id, // Changed from user to userId
            
        })
            .populate("degreeLevel degreeType")
            .sort({ yearOfCompletion: -1 });

        res.status(200).json({
            success: true,
            data: educations,
        });
    } catch (error) {
        console.error("❌ Get Educations Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const toggleEducationStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const education = await Education.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!education) {
            return res.status(404).json({ 
                success: false, 
                message: 'Education not found' 
            });
        }

        // Toggle isActive status
        education.isActive = !education.isActive;
        await education.save();

        res.status(200).json({ 
            success: true, 
            data: education,
            message: `Education ${education.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error("❌ Error toggling education status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get single education by ID
export const getEducationById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid education ID",
            });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const education = await Education.findOne({
            _id: id,
            userId: req.user._id, // Changed from user to userId
            isActive: true,
        }).populate("degreeLevel degreeType");

        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        res.status(200).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error("❌ Get Education Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Update education
export const updateEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid education ID",
            });
        }
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const education = await Education.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id, // Changed from user to userId
                isActive: true,
            },
            updateData,
            { new: true, runValidators: true }
        ).populate("degreeLevel degreeType");

        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Education updated successfully",
            data: education,
        });
    } catch (error) {
        console.error("❌ Update Education Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

//  Delete education (soft delete)

export const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid education ID",
            });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const education = await Education.findOneAndDelete({
            _id: id,
            userId: req.user._id, // Changed from user to userId
        });

        if (!education) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Education deleted successfully",
        });
    } catch (error) {
        console.error("❌ Delete Education Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const getSkills = async (req, res) => {
    try {
        const skills = await Skills.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: skills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleSkillStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const skill = await Skills.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!skill) {
            return res.status(404).json({ 
                success: false, 
                message: 'Skill not found' 
            });
        }

        // Toggle isActive status
        skill.isActive = !skill.isActive;
        await skill.save();

        res.status(200).json({ 
            success: true, 
            data: skill,
            message: `Skill ${skill.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error("❌ Error toggling skill status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createSkill = async (req, res) => {
    try {
        const { skillName, experience } = req.body;
        const skill = new Skills({
            userId: req.user.id,
            skillName,
            experience
        });
        await skill.save();
        res.status(201).json({ success: true, data: skill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { skillName, experience } = req.body;

        const skill = await Skills.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { skillName, experience },
            { new: true }
        );

        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        res.status(200).json({ success: true, data: skill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;

        const skill = await Skills.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isActive: false },
            { new: true }
        );

        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }

        res.status(200).json({ success: true, message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// languages controller (backend)




// export const createLanguage = async (req, res) => {
//     try {
//         const { languageName, proficiency } = req.body;


//         const language = new Language({
//             userId: req.user.id,
//             languageName,
//             proficiency
//         });


//          if (!req.user || !req.user._id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not authenticated",
//             });
//         }
//         await language.save();
//         console.log(language.data);
        

//         res.status(201).json({ success: true, data: language });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };



export const createLanguage = async (req, res) => {
  try {
    const { languageName, proficiency } = req.body;

    if (!languageName || !proficiency) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Optionally link with user
    const userId = req.user?._id || req.body.userId;
    const newLanguage = await Language.create({
      userId,
      languageName,
      proficiency,
    });

    return res.status(201).json({ success: true, data: newLanguage });
  } catch (error) {
    console.error("❌ Error creating language:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLanguages = async (req, res) => {
    try {
        const languages = await Language.find({ userId: req.user.id, })
            .sort({ createdAt: -1 });

            console.log(languages);
            console.log(languages.data);
            
            
        res.status(200).json({ success: true, data: languages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleLanguageStatus = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const language = await Language.findOne({ 
            _id: req.params.id, 
            userId: req.user.id 
        });

        if (!language) {
            return res.status(404).json({ 
                success: false, 
                message: 'Language not found' 
            });
        }

        // Toggle isActive status
        language.isActive = !language.isActive;
        await language.save();

        res.status(200).json({ 
            success: true, 
            data: language,
            message: `Language ${language.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error("❌ Error toggling language status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { languageName, proficiency } = req.body;

        const language = await Language.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { languageName, proficiency },
            { new: true }
        );

        if (!language) {
            return res.status(404).json({ success: false, message: 'Language not found' });
        }

        res.status(200).json({ success: true, data: language });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;

        const language = await Language.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isActive: false },
            { new: true }
        );

        if (!language) {
            return res.status(404).json({ success: false, message: 'Language not found' });
        }

        res.status(200).json({ success: true, message: 'Language deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};