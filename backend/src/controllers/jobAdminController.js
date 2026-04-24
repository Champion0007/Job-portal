const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate('employer', 'name email')
      .populate('company', 'name logo');
    res.json(jobs);
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ message: 'Failed to delete job' });
  }
};

exports.toggleJobBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Pending jobs should be approvable from the admin panel. Once approved,
    // admins can still block and later restore them.
    job.status = job.status === 'approved' ? 'closed' : 'approved';
    await job.save();

    res.json(job);
  } catch (err) {
    console.error('Toggle job status error:', err);
    res.status(500).json({ message: 'Failed to update job' });
  }
};

