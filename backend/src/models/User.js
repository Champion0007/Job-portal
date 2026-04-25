const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  headline: String,
  bio: String,
  location: String,
  photo: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['seeker','employer','admin'], default: 'seeker' },
  // allow common OAuth providers including github
  provider: { type: String, enum: ['email','google','github','phone','facebook','apple'], default: 'email' },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
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

UserSchema.set('toJSON', {
  transform(doc, ret) {
    delete ret.passwordHash;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);
