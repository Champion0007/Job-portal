const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const emailService = require('../services/emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const RESET_TOKEN_EXPIRES_MIN = Number(process.env.RESET_TOKEN_EXPIRES_MIN) || 60;

router.post('/forgot', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ ok: true, message: 'A reset link sent to the registered email_id.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000;
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;
    const subject = 'Job Portal - Password reset';
    const text = `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this message.`;
    const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you didn't request this, ignore this email.</p>`;

    try {
      await emailService.sendMail({ to: user.email, subject, text, html });
    } catch (err) {
      console.error('Error sending reset email', err);
    }

    return res.json({ ok: true, message: 'A reset link sent to the registered email_id.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body;
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!token || !email || !password) {
      return res.status(400).json({ error: 'token, email and password are required' });
    }

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email,
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    try {
      await emailService.sendMail({
        to: user.email,
        subject: 'Your password has been changed',
        text: 'Your password was successfully changed. If you did not perform this action, contact support immediately.',
        html: '<p>Your password was successfully changed.</p>'
      });
    } catch (err) {
      console.error('Password change email error', err);
    }

    return res.json({ ok: true, message: 'Password has been reset' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
