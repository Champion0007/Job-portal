const Job = require("../models/Job");

// ✅ Create Job
exports.createJob = async (req, res) => {
  try {
    const employerId = req.user?.id; // protect middleware se aayega

    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized" });
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
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const job = await Job.create({
      title,
      description,
      location: { city, state, country: country || "India" },
      salary: {
        min: minSalary || null,
        max: maxSalary || null,
      },
      jobType,
      experienceLevel,
      employer: employerId,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
