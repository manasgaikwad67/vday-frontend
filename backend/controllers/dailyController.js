const DailyMessage = require("../models/DailyMessage");
const { generateDailyMessage } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.getToday = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split("T")[0];
    let message = await DailyMessage.findOne({ userId, date: today });

    if (!message) {
      // Generate a new daily message for this user
      try {
        const config = await getUserConfig(userId);
        const content = await generateDailyMessage(config);
        message = await DailyMessage.create({
          userId,
          message: content,
          date: today,
        });
      } catch {
        // Fallback message if AI fails
        return res.json({
          success: true,
          message: {
            message: "Every day with you is a new reason to smile. Good morning, my love 💕",
            date: today,
          },
        });
      }
    }

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const userId = req.userId;
    const messages = await DailyMessage.find({ userId }).sort({ date: -1 }).limit(30);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
