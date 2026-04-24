const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getAllJobs,
  deleteJob,
  toggleJobBlock,
} = require('../controllers/jobAdminController');

const router = express.Router();

router.get('/', auth, adminOnly, getAllJobs);
router.delete('/:id', auth, adminOnly, deleteJob);
router.patch('/:id/block', auth, adminOnly, toggleJobBlock);

module.exports = router;

