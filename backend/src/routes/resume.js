const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const findApplicationForResume = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const appDoc = await Application.findById(id).populate("job");
    if (appDoc) return appDoc;
  }

  return Application.findOne({ resumeUrl: `/uploads/${id}` }).populate("job");
};

router.get("/:id", auth, async (req, res) => {
  try {
    const appDoc = await findApplicationForResume(req.params.id);
    if (!appDoc) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const isCandidateOwner = String(appDoc.candidate) === String(req.user._id);
    const isEmployerOwner =
      appDoc.job && String(appDoc.job.employer) === String(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isCandidateOwner && !isEmployerOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const filename = path.basename(appDoc.resumeUrl || "");
    const filePath = path.join(upload.uploadDir, filename);

    if (!filename || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error("Secure Resume Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
