const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseResume } = require('../services/resumeParser');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });

router.post('/parse-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    const parsed = await parseResume(file.path, file.mimetype);
    const resume = new Resume({ owner: req.user._id, filePath: file.path, parsedJSON: parsed });
    await resume.save();
    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
