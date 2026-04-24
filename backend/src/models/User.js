const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  headline: String,
  bio: String,
  location: String,
  photo: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, index: true, lowercase: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['seeker','employer','admin'], default: 'seeker' },
  // allow common OAuth providers including github
  provider: { type: String, enum: ['email','google','github','phone','facebook','apple'], default: 'email' },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  profile: ProfileSchema,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  skills: [String],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],

  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
