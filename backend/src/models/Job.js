const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema(
  {
    min: Number,
    max: Number,
    currency: { type: String, default: "INR" },
  },
  { _id: false }
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },

    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      city: String,
      state: String,
      country: { type: String, default: "India" },
      lat: Number,
      lng: Number,
    },

    description: { type: String, required: true },

    skills: [String],

    salary: SalarySchema,

    // ✅ ✅ FIXED ENUM — FRONTEND MATCH
    jobType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"],
      default: "Full-Time",
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid", "Senior"],
      default: "Fresher",
    },

    experience: {
      min: Number,
      max: Number,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "closed"],
      default: "pending",
    },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Text search index
JobSchema.index({ title: "text", description: "text", skills: "text" });

module.exports = mongoose.model("Job", JobSchema);
