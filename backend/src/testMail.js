import "dotenv/config";
import { sendMail } from "./services/emailService.js";

async function test() {
  try {
    await sendMail({
      to: "abhinavpal9917@gmail.com",
      subject: "🎉 Resend Test Mail",
      html: "<h2>Email system working perfectly 🚀</h2>",
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
  } catch (err) {
    console.error("❌ MAIL ERROR:", err);
  }
}

test();
