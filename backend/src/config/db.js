const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable if provided; otherwise default to local MongoDB for development.
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      uri = 'mongodb://127.0.0.1:27017/jobportal';
      console.warn('MONGODB_URI not set — defaulting to local MongoDB at', uri);
      console.warn('For production, set MONGODB_URI in backend/.env to a MongoDB Atlas or production URI.');
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
