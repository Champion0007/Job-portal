require('dotenv').config();
const path = require("path");
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
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
    return callback(null, true);
  },
}));
app.use(express.json());

app.use((req, res, next) => {
  if (req.url.startsWith('//api/')) {
    req.url = req.url.replace(/^\/+api\//, '/api/');
  }
  next();
});

// Serve uploaded files from the backend/uploads folder regardless of where the
// server is started from. This avoids 404s when the process cwd changes.
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use(passport.initialize());
app.use('/api/auth', authRoutes);
// Password reset routes (forgot / reset)
app.use('/api/auth/password', passwordRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
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
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
