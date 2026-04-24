const express = require("express");
const Subscriber = require("../models/Subscriber");

const router = express.Router();

/**
 * POST /api/subscribe
 */
router.post("/", async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const subscriber = await Subscriber.create({
      email,
      type: type || "newsletter",
    });

    // (Optional) send confirmation email here later

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber,
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
