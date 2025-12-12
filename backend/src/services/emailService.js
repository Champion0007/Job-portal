const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST || 'smtp.example.com',
  port: process.env.EMAIL_SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async ({ to, subject, text, html }) => {
  const from = process.env.EMAIL_FROM || 'no-reply@example.com';
  return transporter.sendMail({ from, to, subject, text, html });
};

module.exports = { sendMail };
