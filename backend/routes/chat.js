const router = require("express").Router();
const { sendMessage, getHistory, clearHistory } = require("../controllers/chatController");
const { verifyEntry } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyEntry, aiLimiter, sendMessage);
router.get("/history/:sessionId?", verifyEntry, getHistory);
router.delete("/history/:sessionId?", verifyEntry, clearHistory);

module.exports = router;
