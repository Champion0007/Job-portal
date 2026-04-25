const express = require('express');
const { sendMail } = require('../services/emailService');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'name, email and message are required' });
    }

    const to = process.env.CONTACT_TO || process.env.EMAIL_FROM || 'support@jobportal.example';
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    await sendMail({
      to,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><hr/><p>${safeMessage}</p>`
    });

    await ContactMessage.create({ name, email, message, status: 'new' });

    if (process.env.EMAIL_FROM) {
      try {
        await sendMail({
          to: email,
          subject: 'Thanks for contacting JobPortal',
          text: `Hi ${name},\n\nThanks for reaching out. We received your message and will respond shortly.\n\n- JobPortal Team`,
          html: `<p>Hi ${safeName},</p><p>Thanks for reaching out. We received your message and will respond shortly.</p><p>- JobPortal Team</p>`
        });
      } catch (err) {
        console.warn('Auto-reply failed', err.message);
      }
    }

    return res.json({ ok: true, message: 'Message sent' });
  } catch (err) {
    console.error('Contact route error', err);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
