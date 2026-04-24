const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getAllUsers,
  toggleUserBlock,
} = require('../controllers/userAdminController');

const router = express.Router();

router.get('/', auth, adminOnly, getAllUsers);
router.patch('/:id/block', auth, adminOnly, toggleUserBlock);

module.exports = router;

