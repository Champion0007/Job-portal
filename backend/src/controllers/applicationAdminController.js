const Application = require('../models/Application');

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .sort({ createdAt: -1 })
      .populate('job', 'title')
      .populate('candidate', 'name email');
    res.json(apps);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewResponse } = req.body; // 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(interviewResponse)) {
      return res.status(400).json({ message: 'Invalid interview response' });
    }

    const appDoc = await Application.findByIdAndUpdate(
      id,
      { interviewResponse },
      { new: true }
    );
    if (!appDoc) return res.status(404).json({ message: 'Application not found' });

    res.json(appDoc);
  } catch (err) {
    console.error('Update interview status error:', err);
    res.status(500).json({ message: 'Failed to update application' });
  }
};

