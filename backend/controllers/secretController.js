const Secret = require("../models/Secret");

exports.getQuestions = async (req, res) => {
  try {
    const userId = req.userId;
    let secret = await Secret.findOne({ userId, isActive: true });

    if (!secret) {
      // Return empty if no secret game configured for this user
      return res.json({ success: true, questions: [], message: "Secret game not configured yet" });
    }

    // Only send questions, not answers
    const questions = secret.questions.map((q) => ({
      _id: q._id,
      question: q.question,
    }));

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyAnswers = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionId, answer }]
    const userId = req.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Answers are required" });
    }

    const secret = await Secret.findOne({ userId, isActive: true });
    if (!secret) {
      return res.status(404).json({ success: false, message: "No secret game found" });
    }

    let correct = 0;
    for (const submitted of answers) {
      const question = secret.questions.id(submitted.questionId);
      if (
        question &&
        question.answer &&
        submitted.answer.toLowerCase().trim() === question.answer.toLowerCase().trim()
      ) {
        correct++;
      }
    }

    const allCorrect = correct === secret.questions.length;

    res.json({
      success: true,
      correct,
      total: secret.questions.length,
      unlocked: allCorrect,
      secretMessage: allCorrect ? secret.secretMessage : null,
      videoUrl: allCorrect ? secret.videoUrl : null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSecret = async (req, res) => {
  try {
    const { questions, secretMessage, videoUrl } = req.body;
    const userId = req.userId;

    const secret = await Secret.findOneAndUpdate(
      { userId },
      { userId, questions, secretMessage, videoUrl, isActive: true },
      { new: true, upsert: true }
    );

    res.json({ success: true, secret });
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
