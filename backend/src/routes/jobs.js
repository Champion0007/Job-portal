const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * ✅ Create a job (Employer only)
 * POST /api/jobs
 */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const {
      title,
      description,
      city,
      state,
      country,
      minSalary,
      maxSalary,
      jobType,
      experienceLevel,
      skills,
    } = req.body;

    const job = new Job({
      title,
      description,

      // ✅ ✅ LOCATION MAPPING FIX
      location: {
        city: city || "",
        state: state || "",
        country: country || "India",
      },

      // ✅ ✅ SALARY MAPPING FIX
      salary: {
        min: minSalary ? Number(minSalary) : undefined,
        max: maxSalary ? Number(maxSalary) : undefined,
      },

      // ✅ EXPERIENCE LEVEL
      experienceLevel: experienceLevel || "Fresher",

      // ✅ JOB TYPE
      jobType,

      // ✅ OPTIONAL SKILLS
      skills: Array.isArray(skills) ? skills : [],

      employer: req.user._id,
      company: req.user.company,
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Employer: list jobs created by authenticated employer
 * GET /api/jobs/employer
 *
 * IMPORTANT: ye route `/:id` se upar hona chahiye
 */
router.get("/employer", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    console.error("Employer Jobs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ List all jobs with filters
 * GET /api/jobs
 */
router.get("/", async (req, res) => {
  try {
    const { q, location, jobType, page = 1, perPage = 10 } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (location)
      filter["location.city"] = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;

    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;

    const jobs = await Job.find(filter)
      .skip((pageNum - 1) * perPageNum)
      .limit(perPageNum)
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("List Jobs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Get single job by id
 * GET /api/jobs/:id
 *
 * NOTE: ye LAST me hona chahiye
 */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company employer"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Get Single Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
