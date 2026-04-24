const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard-stats', auth, adminOnly, getDashboardStats);

module.exports = router;

