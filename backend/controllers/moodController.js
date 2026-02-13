const { moodResponse } = require("../services/groqService");

exports.analyze = async (req, res) => {
  try {
    const { mood, details } = req.body;

    const validMoods = ["sad", "stressed", "happy", "angry", "anxious", "lonely", "loved"];
    if (!mood || !validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid mood",
        validMoods,
      });
    }

    const response = await moodResponse(mood, details);
    res.json({ success: true, mood, response });
  } catch (error) {
    console.error("Mood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
