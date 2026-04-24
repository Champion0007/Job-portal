const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ContactMessage = require('../models/ContactMessage');

exports.getDashboardStats = async (req, res) => {
  try {
    const [usersCount, jobsCount, applicationsCount, newMessagesCount] =
      await Promise.all([
        User.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        ContactMessage.countDocuments({ status: 'new' }),
      ]);

    return res.json({
      usersCount,
      jobsCount,
      applicationsCount,
      newMessagesCount,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

