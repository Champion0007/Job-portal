const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const passport = require("passport");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function publicUser(user) {
  return {
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
    profile: user.profile,
    company: user.company,
    resume: user.resume,
    skills: user.skills,
    isVerified: user.isVerified,
  };
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function oauthSuccessRedirect(token) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return `${frontendUrl}/auth/success#token=${encodeURIComponent(token)}`;
}

function frontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:3000";
}

/* ======================
   REGISTER (SEEKER / EMPLOYER)
====================== */
router.post("/register", async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const safeRole = ["seeker", "employer"].includes(role) ? role : "seeker";

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: safeRole,
    });

    const token = signToken(user);

    res.json({
      token,
      user: publicUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADMIN REGISTER
====================== */
router.post("/admin-register", async (req, res) => {
  try {
    const { name, password, adminCode } = req.body;
    const email = normalizeEmail(req.body.email);

    if (adminCode !== process.env.ADMIN_REG_CODE)
      return res.status(403).json({ message: "Invalid admin code" });

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
    });

    const token = signToken(user);

    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Account blocked" });

    if (!user.passwordHash)
      return res
        .status(400)
        .json({ message: "Please login with your social account" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   GOOGLE AUTH
====================== */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // ✅ BLOCK CHECK
    if (req.user.isBlocked) {
      return res.redirect(`${frontendUrl()}/login?error=blocked`);
    }

    const token = signToken(req.user);

    res.redirect(oauthSuccessRedirect(token));
  },
);

/* ======================
   GITHUB AUTH
====================== */
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    // ✅ BLOCK CHECK
    if (req.user.isBlocked) {
      return res.redirect(`${frontendUrl()}/login?error=blocked`);
    }

    const token = signToken(req.user);

    res.redirect(oauthSuccessRedirect(token));
  },
);

/* ======================
   FORGOT / RESET PASSWORD
====================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "If email exists, link sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

    await sendEmail({
      to: email,
      subject: "Reset Password",
      html: `<a href="${link}">Reset Password</a>`,
    });

    res.json({ message: "Reset link sent" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const email = normalizeEmail(req.body.email);
  const hashedToken = crypto
    .createHash("sha256")
    .update(token || "")
    .digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
});

module.exports = router;
