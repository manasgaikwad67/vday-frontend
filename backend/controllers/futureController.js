const { generateFuture } = require("../services/groqService");

exports.predict = async (_req, res) => {
  try {
    const prediction = await generateFuture();
    res.json({ success: true, prediction });
  } catch (error) {
    console.error("Future error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
