const Chat = require("../models/Chat");
const Letter = require("../models/Letter");
const Memory = require("../models/Memory");
const Visitor = require("../models/Visitor");
const DailyMessage = require("../models/DailyMessage");
const Secret = require("../models/Secret");

exports.getDashboard = async (_req, res) => {
  try {
    const [chatCount, letterCount, memoryCount, visitor, dailyCount] = await Promise.all([
      Chat.countDocuments(),
      Letter.countDocuments(),
      Memory.countDocuments(),
      Visitor.findOne(),
      DailyMessage.countDocuments(),
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

exports.getChatLogs = async (_req, res) => {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLetters = async (_req, res) => {
  try {
    const letters = await Letter.find().sort({ createdAt: -1 });
    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSecret = async (_req, res) => {
  try {
    const secret = await Secret.findOne({ isActive: true });
    res.json({ success: true, secret });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
