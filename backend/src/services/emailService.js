const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function sendMail({ to, subject, text, html }) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
