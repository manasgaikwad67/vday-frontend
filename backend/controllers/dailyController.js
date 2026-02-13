const DailyMessage = require("../models/DailyMessage");

exports.getToday = async (_req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const message = await DailyMessage.findOne({ date: today });

    if (!message) {
      return res.json({
        success: true,
        message: {
          message: "Every day with you is a new reason to smile. Good morning, my love 💕",
          date: today,
        },
      });
    }

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const messages = await DailyMessage.find().sort({ date: -1 }).limit(30);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
