const Chat = require("../models/Chat");
const { boyfriendChat } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    const userId = req.userId;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get or create conversation for this user
    let chat = await Chat.findOne({ userId, sessionId });
    if (!chat) {
      chat = new Chat({ userId, sessionId, messages: [] });
    }

    // Build conversation history for context
    const history = chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get user config for personalization
    const config = await getUserConfig(userId);

    // Get AI response with personalized config
    const reply = await boyfriendChat(history, message.trim(), config);

    // Save both messages
    chat.messages.push(
      { role: "user", content: message.trim() },
      { role: "assistant", content: reply }
    );
    await chat.save();

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    const userId = req.userId;
    const chat = await Chat.findOne({ userId, sessionId });
    res.json({ success: true, messages: chat?.messages || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    const userId = req.userId;
    await Chat.findOneAndDelete({ userId, sessionId });
    res.json({ success: true, message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
