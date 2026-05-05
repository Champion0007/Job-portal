const express = require('express');
const { parseResume } = require('../services/resumeParser');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/parse-resume', auth, upload.single('resume'), upload.handleUploadError, async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const parsed = await parseResume(file.path, file.mimetype);
    const resume = new Resume({ owner: req.user._id, filePath: file.path, parsedJSON: parsed });
    await resume.save();
    res.json({
      resume,
      analysis: parsed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
