require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const passport = require("passport");
require("./config/passport");




// Fail fast when required environment variables are missing.
const requiredEnvs = ['JWT_SECRET'];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}\nPlease add them to backend/.env or your environment before starting the server.`);
  process.exit(1);
}

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const adminMessagesRoutes = require('./routes/messages');
const adminJobsRoutes = require('./routes/adminJobs');
const adminUsersRoutes = require('./routes/adminUsers');
const adminApplicationsRoutes = require('./routes/adminApplications');
const userRoutes = require("./routes/user");
const subscribeRoutes = require('./routes/subscribe');
const adminSubscribersRoutes = require("./routes/adminSubscribers");
const passwordRoutes = require('./routes/password');





const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

app.use(helmet());
const strictAllowedOrigins = [
  'http://localhost:3000',
  'https://job-portal-snowy-pi.vercel.app',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (strictAllowedOrigins.includes(cleanOrigin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

app.use((req, res, next) => {
  if (req.url.startsWith('//api/')) {
    req.url = req.url.replace(/^\/+api\//, '/api/');
  }
  next();
});

app.use(passport.initialize());
app.use('/api/auth', authRoutes);
// Password reset routes (forgot / reset)
app.use('/api/auth/password', passwordRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/resume', require('./routes/resume'));
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/subscribe", subscribeRoutes);

// Admin API routes (protected via JWT + role=admin)
app.use('/api/admin', adminRoutes);
app.use('/api/admin/messages', adminMessagesRoutes);
app.use('/api/admin/jobs', adminJobsRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/applications', adminApplicationsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/subscribers", adminSubscribersRoutes);




app.get('/', (req, res) => res.json({ ok: true, message: 'Job Portal API' }));

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Not allowed by CORS' });
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
