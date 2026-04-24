const express = require("express");
const Subscriber = require("../models/Subscriber");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const subs = await Subscriber.find().sort({ createdAt: -1 });
  res.json(subs);
});

module.exports = router;
