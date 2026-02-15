const Chat = require("../models/Chat");
const { boyfriendChat } = require("../services/groqService");

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Get or create conversation
    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }

    // Build conversation history for context
    const history = chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Get AI response
    const rawReply = await boyfriendChat(history, message.trim());

    // Split into multiple message bubbles (Manas sends bursts of short texts)
    // Handle all variations: literal "\n---\n", actual newlines, "---", etc.
    const bubbles = rawReply
      .replace(/\\n/g, "\n")           // convert literal \n to real newlines
      .split(/\n?\s*---\s*\n?/)        // split on --- with optional whitespace/newlines
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // Save user message
    chat.messages.push({ role: "user", content: message.trim() });

    // Save each bubble as a separate assistant message
    for (const bubble of bubbles) {
      chat.messages.push({ role: "assistant", content: bubble });
    }
    await chat.save();

    res.json({ success: true, reply: rawReply, bubbles });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    const chat = await Chat.findOne({ sessionId });
    res.json({ success: true, messages: chat?.messages || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.params;
    await Chat.findOneAndDelete({ sessionId });
    res.json({ success: true, message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
