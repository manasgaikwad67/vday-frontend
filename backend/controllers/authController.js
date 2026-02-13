const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Visitor = require("../models/Visitor");
const { getConnectionStatus } = require("../config/db");

// Verify entry password
exports.verifyEntry = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (password !== process.env.ENTRY_PASSWORD) {
      return res.status(401).json({ success: false, message: "Wrong password, my love 💔" });
    }

    // Increment visitor count (only if DB connected)
    if (getConnectionStatus()) {
      try {
        await Visitor.findOneAndUpdate(
          {},
          { $inc: { count: 1 }, lastVisit: new Date() },
          { upsert: true }
        );
      } catch {}
    }

    const token = jwt.sign({ entry: true }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({
      success: true,
      token,
      config: {
        herName: process.env.HER_NAME || "My Love",
        myName: process.env.MY_NAME || "Your Love",
        relationshipStart: process.env.RELATIONSHIP_START_DATE || "2024-02-14",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
