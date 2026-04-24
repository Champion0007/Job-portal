const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // ✅ multer

const router = express.Router();

/**
 * ✅ Candidate applies to a job WITH full details + resume
 * POST /api/applications
 * Body: form-data (multipart)
 */
router.post(
  "/",
  auth,
  upload.single("resume"), // ✅ resume field name
  async (req, res) => {
    try {
      if (req.user.role !== "seeker" && req.user.role !== "candidate") {
        return res.status(403).json({ message: "Only job seekers can apply" });
      }

      const {
        jobId,
        fullName,
        email,
        phone,
        city,
        experienceYears,
        currentCompany,
        currentRole,
        skills,
        coverLetter,
      } = req.body;

      if (!jobId) {
        return res.status(400).json({ message: "jobId is required" });
      }

      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // check already applied
      const existing = await Application.findOne({
        job: jobId,
        candidate: req.user._id,
      });

      if (existing) {
        return res
          .status(400)
          .json({ message: "You have already applied to this job" });
      }

      // ✅ resumeUrl from uploaded file
      const resumeUrl = req.file ? `/uploads/${req.file.filename}` : "";

      const application = await Application.create({
        job: jobId,
        candidate: req.user._id,
        fullName,
        email,
        phone,
        city,
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        currentCompany,
        currentRole,
        skills: skills
          ? skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        coverLetter: coverLetter || "",
        resumeUrl,
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (err) {
      console.error("Apply Job Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * ✅ Employer: view all applications for a job (with full details)
 * GET /api/applications/job/:jobId
 */
router.get("/job/:jobId", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (
      String(job.employer) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const apps = await Application.find({ job: job._id })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("Get Job Applications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Candidate: view own applications
 * GET /api/applications/mine
 */
router.get("/mine", auth, async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error("Get My Applications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Employer: Update application status
 * PATCH /api/applications/:id/status
 * Body: { status }
 */
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "applied",
      "reviewed",
      "shortlisted",
      "interview",
      "rejected",
      "hired",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appDoc = await Application.findById(req.params.id).populate("job");

    if (!appDoc) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Only employer of this job OR admin can change status
    if (
      String(appDoc.job.employer) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    appDoc.status = status;
    await appDoc.save();

    res.json({
      message: "Application status updated",
      application: appDoc,
    });
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🆕 Employer: Schedule interview for an application
 * PATCH /api/applications/:id/interview
 * Body: { date, mode, location, link, notes }
 */
router.patch("/:id/interview", auth, async (req, res) => {
  try {
    const { date, mode, location, link, notes } = req.body;

    const appDoc = await Application.findById(req.params.id).populate("job");
    if (!appDoc) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Only employer of this job or admin can schedule
    if (
      String(appDoc.job.employer) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ✅ Save interview details + set status = interview
    appDoc.interview = {
      date: date ? new Date(date) : null,
      mode,
      location,
      link,
      notes,
    };
    appDoc.status = "interview";

    await appDoc.save();

    res.json({
      message: "Interview scheduled successfully",
      application: appDoc,
    });
  } catch (err) {
    console.error("Schedule Interview Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
