const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // ✅ Job being applied to
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ✅ Candidate who applied
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ ✅ PERSONAL DETAILS (AUTO + MANUAL)
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
    },

    // ✅ ✅ EXPERIENCE SECTION
    experienceYears: {
      type: Number,
      default: 0,
    },

    currentCompany: {
      type: String,
    },

    currentRole: {
      type: String,
    },

    skills: {
      type: [String],
      default: [],
    },

    // ✅ ✅ RESUME STORAGE (PDF URL)
    resumeUrl: {
      type: String,
      required: true,
    },

    // ✅ Optional cover letter from seeker
    coverLetter: {
      type: String,
    },

    aiScore: {
      type: Number,
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    resumeSummary: {
      type: String,
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    // 🆕 INTERVIEW DETAILS
    interview: {
      date: Date,
      mode: String, // e.g. "online" | "in-person"
      location: String, // office address (if in-person)
      link: String, // meet/zoom link (if online)
      notes: String, // extra info for candidate
    },

    // ✅ Interview response from candidate
    interviewResponse: {
      type: String,
      enum: ["accepted", "rejected"],
    },

    // ✅ Application Status
    status: {
      type: String,
      enum: [
        "applied",
        "reviewed",
        "shortlisted",
        "interview",
        "rejected",
        "hired",
        "withdrawn",
      ],
      default: "applied",
    },
  },
  { timestamps: true }
);

// ✅ ✅ DUPLICATE APPLY PROTECTION
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
