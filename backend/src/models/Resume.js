const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filePath: String,
  parsedJSON: Object,
  score: Number
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
