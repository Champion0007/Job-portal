const express = require('express');
const { sendMail } = require('../services/emailService');

const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'name, email and message are required' });

    const to = process.env.CONTACT_TO || process.env.EMAIL_FROM || 'support@jobportal.example';
    const subject = `New contact form submission from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const html = `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`;

    // send to site support
    await sendMail({ to, subject, text, html });

    // optional auto-reply to user (if EMAIL_FROM is configured)
    if (process.env.EMAIL_FROM) {
      const replySubject = 'Thanks for contacting JobPortal';
      const replyText = `Hi ${name},\n\nThanks for reaching out. We received your message and will respond shortly.\n\n— JobPortal Team`;
      const replyHtml = `<p>Hi ${name},</p><p>Thanks for reaching out. We received your message and will respond shortly.</p><p>— JobPortal Team</p>`;
      try {
        await sendMail({ to: email, subject: replySubject, text: replyText, html: replyHtml });
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
