const express = require('express');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.get('/', auth, adminOnly, getMessages);
router.patch('/:id/status', auth, adminOnly, updateMessageStatus);
router.delete('/:id', auth, adminOnly, deleteMessage);

module.exports = router;

