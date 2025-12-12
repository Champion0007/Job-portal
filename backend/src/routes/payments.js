const express = require('express');
const stripeLib = require('stripe');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

const router = express.Router();

// Fail fast with a clear error if Stripe key is missing; avoids runtime crashes
// when a payment is attempted without configuration.
const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret ? stripeLib(stripeSecret) : null;

// Create Stripe PaymentIntent for a job post
router.post('/create-intent', auth, async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured. Set STRIPE_SECRET in backend/.env.' });
    }

    const { amount, currency = 'INR', jobId } = req.body;
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Forbidden' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { employerId: req.user._id, jobId }
    });
    const payment = new Payment({ employer: req.user._id, jobId, amount, currency, provider: 'stripe', paymentId: paymentIntent.id, status: 'created' });
    await payment.save();
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
