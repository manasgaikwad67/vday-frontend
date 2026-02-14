const router = require("express").Router();
const { sendMessage, getHistory, clearHistory } = require("../controllers/chatController");
const { verifyAccess } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyAccess, aiLimiter, sendMessage);
router.get("/history/:sessionId?", verifyAccess, getHistory);
router.delete("/history/:sessionId?", verifyAccess, clearHistory);

module.exports = router;
