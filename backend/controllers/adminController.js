const Chat = require("../models/Chat");
const Letter = require("../models/Letter");
const Memory = require("../models/Memory");
const Visitor = require("../models/Visitor");
const DailyMessage = require("../models/DailyMessage");
const Secret = require("../models/Secret");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const [chatCount, letterCount, memoryCount, visitor, dailyCount] = await Promise.all([
      Chat.countDocuments({ userId }),
      Letter.countDocuments({ userId }),
      Memory.countDocuments({ userId }),
      Visitor.findOne({ userId }),
      DailyMessage.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      dashboard: {
        totalChats: chatCount,
        totalLetters: letterCount,
        totalMemories: memoryCount,
        visitorCount: visitor?.count || 0,
        lastVisit: visitor?.lastVisit || null,
        totalDailyMessages: dailyCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatLogs = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLetters = async (req, res) => {
  try {
    const userId = req.userId;
    const letters = await Letter.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSecret = async (req, res) => {
  try {
    const userId = req.userId;
    const secret = await Secret.findOne({ userId });
    res.json({ success: true, secret });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
