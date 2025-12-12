const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  amount: Number,
  currency: { type: String, default: 'INR' },
  provider: String,
  paymentId: String,
  status: String,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
