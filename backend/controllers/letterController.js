const Letter = require("../models/Letter");
const { generateLetter } = require("../services/groqService");

exports.generate = async (req, res) => {
  try {
    const { style = "romantic" } = req.body;

    const validStyles = ["romantic", "funny", "emotional", "bollywood", "future-husband", "comfort"];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ success: false, message: "Invalid letter style" });
    }

    const content = await generateLetter(style);

    // Save to database
    const letter = await Letter.create({ style, content });

    res.json({ success: true, letter });
  } catch (error) {
    console.error("Letter error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const letters = await Letter.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, letters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ success: false, message: "Letter not found" });
    }
    res.json({ success: true, letter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Letter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Letter deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
