const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getAllApplications,
  updateInterviewStatus,
} = require('../controllers/applicationAdminController');

const router = express.Router();

router.get('/', auth, adminOnly, getAllApplications);
router.patch('/:id/interview-response', auth, adminOnly, updateInterviewStatus);

module.exports = router;

