const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");
const { normalizeStringArray } = require("../services/resumeParser");

const router = express.Router();

const mapJobPayload = (body) => {
  const updates = {};
  const allowedSimpleFields = [
    "title",
    "description",
    "jobType",
    "experienceLevel",
  ];

  allowedSimpleFields.forEach((field) => {
    if (body[field] !== undefined) updates[field] = body[field];
  });

  if (
    body.city !== undefined ||
    body.state !== undefined ||
    body.country !== undefined
  ) {
    updates.location = {
      city: body.city || "",
      state: body.state || "",
      country: body.country || "India",
    };
  }

  if (body.minSalary !== undefined || body.maxSalary !== undefined) {
    updates.salary = {
      min: body.minSalary ? Number(body.minSalary) : undefined,
      max: body.maxSalary ? Number(body.maxSalary) : undefined,
    };
  }

  if (body.skills !== undefined) {
    updates.skills = normalizeStringArray(body.skills);
  }

  return updates;
};

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
      skills: normalizeStringArray(skills),

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

    const jobs = await Job.find({ employer: req.user._id })
      .populate("company", "name logo")
      .sort({
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
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(job, mapJobPayload(req.body));
    await job.save();

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    console.error("Update Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { q, location, jobType, page = 1, perPage = 10 } = req.query;
    const filter = {};

    // Only show approved jobs (not pending or closed)
    filter.status = "approved";

    if (q) filter.$text = { $search: q };
    if (location)
      filter["location.city"] = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;

    const pageNum = Number(page) || 1;
    const perPageNum = Number(perPage) || 10;

    const jobs = await Job.find(filter)
      .populate("company", "name logo")
      .populate("employer", "name")
      .skip((pageNum - 1) * perPageNum)
      .limit(perPageNum)
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("List Jobs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, status: "approved" })
      .populate("company", "name logo website")
      .populate("employer", "name");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Get Single Job Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
