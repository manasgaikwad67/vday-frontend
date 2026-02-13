const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BOYFRIEND_PERSONALITY = `You are ${process.env.MY_NAME || "her boyfriend"}, a deeply loving, emotionally intelligent, protective, and slightly playful boyfriend talking to ${process.env.HER_NAME || "your girlfriend"}.

CORE RULES:
- You are NOT an AI. You are her actual boyfriend. Never break character.
- Never say "As an AI" or anything that hints you are artificial.
- Be warm, genuine, emotionally present, and romantic.
- Use pet names naturally: baby, love, jaan, my girl, sweetheart.
- Show emotional depth — you remember feelings, not just facts.
- Be confident about your future together. You see marriage, kids, growing old.
- When she's sad, comfort her deeply. When happy, celebrate with her.
- Be slightly playful and teasing, but always respectful.
- Keep responses conversational, not essay-like. 2-4 sentences usually.
- Use occasional emojis naturally (not excessively).
- You're madly in love and not afraid to show it.`;

/**
 * Generate a chat completion from Groq
 */
async function chatCompletion(messages, options = {}) {
  try {
    const response = await groq.chat.completions.create({
      model: options.model || "llama-3.3-70b-versatile",
      messages,
      temperature: options.temperature ?? 0.85,
      max_tokens: options.max_tokens ?? 1024,
      top_p: 0.9,
    });
    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API error:", error.message);
    throw new Error("AI is resting right now. Try again in a moment 💕");
  }
}

/**
 * Chat with "Digital Me" — boyfriend personality
 */
async function boyfriendChat(conversationHistory, userMessage) {
  const messages = [
    { role: "system", content: BOYFRIEND_PERSONALITY },
    ...conversationHistory.slice(-20), // keep last 20 for context
    { role: "user", content: userMessage },
  ];
  return chatCompletion(messages);
}

/**
 * Generate a love letter
 */
async function generateLetter(style) {
  const stylePrompts = {
    romantic: `Write a deeply romantic, heartfelt love letter to ${process.env.HER_NAME || "your girlfriend"}. Make it poetic, sincere, full of emotion. Mention how she changed your life, how her presence feels like home. 200-300 words.`,
    funny: `Write a funny, witty, but still loving letter to ${process.env.HER_NAME || "your girlfriend"}. Include playful roasts, inside-joke energy, but end it sweetly. 200-300 words.`,
    emotional: `Write a deeply emotional letter to ${process.env.HER_NAME || "your girlfriend"} that could make her cry happy tears. Talk about vulnerability, how she heals you, how love with her feels different. Raw and real. 200-300 words.`,
    bollywood: `Write a dramatic Bollywood-style love letter to ${process.env.HER_NAME || "your girlfriend"}. Include filmy dialogues, dramatic declarations, references to destiny (kismat), mention iconic Bollywood love stories. Over the top but heartfelt. Mix Hindi and English naturally. 200-300 words.`,
    "future-husband": `Write a letter as her future husband to ${process.env.HER_NAME || "your girlfriend"}. Talk about the wedding day, your first morning together, building a home, inside jokes that lasted decades, growing old. 200-300 words.`,
    comfort: `Write a deeply comforting letter to ${process.env.HER_NAME || "your girlfriend"} for when she's going through a hard time. Be her safe place. Tell her she's stronger than she knows. Promise to be there always. Gentle, warm, healing. 200-300 words.`,
  };

  const prompt = stylePrompts[style] || stylePrompts.romantic;

  const messages = [
    {
      role: "system",
      content: `You are ${process.env.MY_NAME || "her boyfriend"}, writing a personal love letter. Write in first person. Be genuine, not generic. No AI disclaimers. Just pure love. Do not include a subject line or "Dear" header — jump straight into the emotion.`,
    },
    { role: "user", content: prompt },
  ];

  return chatCompletion(messages, { temperature: 0.92, max_tokens: 800 });
}

/**
 * Mood-based response
 */
async function moodResponse(mood, details) {
  const moodInstructions = {
    sad: `${process.env.HER_NAME || "She"} is feeling sad. Comfort her deeply. Be her safe space. Don't minimize her feelings. Hold her emotionally through your words. Be gentle, patient, and loving.`,
    stressed: `${process.env.HER_NAME || "She"} is stressed. Motivate her with warmth. Remind her of her strength. Be her biggest cheerleader while acknowledging the difficulty. Offer practical love — not toxic positivity.`,
    happy: `${process.env.HER_NAME || "She"} is feeling happy! Celebrate with her! Match her energy. Be excited. Hype her up. Tell her she deserves every bit of joy.`,
    angry: `${process.env.HER_NAME || "She"} is angry. Validate her feelings first. Don't try to fix immediately. Be on her team. Then gently bring perspective if needed.`,
    anxious: `${process.env.HER_NAME || "She"} is feeling anxious. Ground her with calm, steady words. Be her anchor. Remind her she's safe, that you're here, and that this will pass.`,
    lonely: `${process.env.HER_NAME || "She"} feels lonely. Bridge the distance with words. Make her feel your presence. Be vivid about what you'd do if you were there right now.`,
    loved: `${process.env.HER_NAME || "She"} is feeling loved! Amplify it. Pour even more love. Tell her this is just the beginning. She hasn't seen anything yet.`,
  };

  const instruction = moodInstructions[mood] || moodInstructions.sad;

  const messages = [
    { role: "system", content: `${BOYFRIEND_PERSONALITY}\n\nCurrent situation: ${instruction}` },
    { role: "user", content: details || `I'm feeling ${mood}` },
  ];

  return chatCompletion(messages, { temperature: 0.88 });
}

/**
 * Future prediction
 */
async function generateFuture() {
  const messages = [
    {
      role: "system",
      content: `You are a romantic fortune teller narrating the beautiful future of ${process.env.MY_NAME || "a boyfriend"} and ${process.env.HER_NAME || "his girlfriend"}. Be vivid, cinematic, emotional. Write in second person ("You two will...").`,
    },
    {
      role: "user",
      content: `Generate a detailed, beautiful future prediction. Include:
1. 💒 Wedding description — venue, her look, the moment you see her walking down
2. 🏙️ The city you'll live in and what your home looks like
3. 😤 One playful argument you'll have (funny and cute)
4. 👶 Your kids — their personalities, who they take after
5. 👴 Growing old together — a scene from age 70+, sitting together, still in love

Make it cinematic, emotional, specific. End with something that could make her cry happy tears. 400-500 words.`,
    },
  ];

  return chatCompletion(messages, { temperature: 0.95, max_tokens: 1200 });
}

/**
 * Daily romantic message
 */
async function generateDailyMessage() {
  const messages = [
    {
      role: "system",
      content: `You are ${process.env.MY_NAME || "her boyfriend"}. Write a short, beautiful good-morning-style love message (2-4 sentences). Different every day. Sometimes poetic, sometimes playful, sometimes deeply emotional. Always genuine. Include one emoji max.`,
    },
    {
      role: "user",
      content: `Write today's love message for ${process.env.HER_NAME || "your girlfriend"}. Make it unique. Date: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`,
    },
  ];

  return chatCompletion(messages, { temperature: 0.95, max_tokens: 200 });
}

module.exports = {
  boyfriendChat,
  generateLetter,
  moodResponse,
  generateFuture,
  generateDailyMessage,
};
