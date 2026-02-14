const { generateFuture } = require("../services/groqService");
const { getUserConfig } = require("../services/userService");

exports.predict = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user config for personalization
    const config = await getUserConfig(userId);
    const prediction = await generateFuture(config);
    res.json({ success: true, prediction });
  } catch (error) {
    console.error("Future error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
