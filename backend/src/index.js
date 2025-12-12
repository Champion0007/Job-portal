require('dotenv').config();
const path = require("path");
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

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
const paymentsRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve uploaded files from the backend/uploads folder regardless of where the
// server is started from. This avoids 404s when the process cwd changes.
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'Job Portal API' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
