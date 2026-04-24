const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTest() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: process.env.EMAIL_SMTP_PORT == '465', // true for 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'Test email from JobPortal',
      text: 'This is a test email to verify SMTP settings.',
    });
    console.log('Email sent:', info.messageId, info);
  } catch (err) {
    console.error('Send test failed:', err);
  }
}

sendTest();