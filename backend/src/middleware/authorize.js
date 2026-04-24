const User = require('../models/User');

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.includes(req.user.role) || req.user.role === 'admin') return next();
    return res.status(403).json({ error: 'Forbidden' });
  };
}

async function requireJobOwner(req, res, next) {
  const Job = require('../models/Job');
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.employer.toString() === req.user.id || req.user.role === 'admin') {
      req.job = job;
      return next();
    }
    return res.status(403).json({ error: 'Not authorized' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { requireRole, requireJobOwner };