import mongoose from "mongoose";

// ==================== Education Schema ====================
const educationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    degreeLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DegreeLevelCategory",
      required: true,
    },
    degreeType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DegreeTypeCategory",
      required: true,
    },
    degreeTitle: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfCompletion: {
      type: String,
      required: true,
    },

    country: { ref: 'Country', type: String, },
    state: { ref: 'State', type: String, },
    city: { ref: 'City', type: String, },


    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);



// ==================== Experience Schema ====================
const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
    },

    country: { ref: 'Country', type: String, },
    state: { ref: 'State', type: String, },
    city: { ref: 'City', type: String, },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    // 🔹 ADD: isActive field
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);


const skillsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true })


const languagesSchema = new mongoose.Schema({


  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    languageName: {
        type: String,
        required: [true, 'Language name is required'],
        trim: true
    },
  proficiency: {
        type: String,
        required: [true, 'Proficiency level is required'],
        enum: ['Beginner', 'Intermediate', 'Expert', 'Native']
    },


     isActive: {
    type: Boolean,
    default: true
  }
},

{ timestamps: true}

)

// ==================== Exports ====================
export const Education = mongoose.model("education", educationSchema);
export const Experience = mongoose.model("experience", experienceSchema);
export const Skills = mongoose.model("buildSkills", skillsSchema);
export const Language = mongoose.model("buildlanguages", languagesSchema);


