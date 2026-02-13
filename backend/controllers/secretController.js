const Secret = require("../models/Secret");

exports.getQuestions = async (_req, res) => {
  try {
    let secret = await Secret.findOne({ isActive: true });

    if (!secret) {
      // Seed default questions
      secret = await Secret.create({
        questions: [
          { question: "What was the first thing I said to you?", answer: "" },
          { question: "What's our song?", answer: "" },
          { question: "Where did we have our first date?", answer: "" },
        ],
        secretMessage:
          "You remembered everything. Every little moment. That's how I know this is real. You don't just love me — you pay attention to me. And in a world full of distractions, that's the most romantic thing anyone could do. I love you more than words on any screen could ever capture. 💕",
        isActive: true,
      });
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

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Answers are required" });
    }

    const secret = await Secret.findOne({ isActive: true });
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

    const secret = await Secret.findOneAndUpdate(
      { isActive: true },
      { questions, secretMessage, videoUrl },
      { new: true, upsert: true }
    );

    res.json({ success: true, secret });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
