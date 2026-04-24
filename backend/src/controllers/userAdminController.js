const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin accounts' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Toggle user block error:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

