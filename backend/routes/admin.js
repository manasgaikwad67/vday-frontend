const router = require("express").Router();
const { verifyAdmin } = require("../middleware/auth");
const { getDashboard, getChatLogs, getLetters, getSecret } = require("../controllers/adminController");

router.get("/dashboard", verifyAdmin, getDashboard);
router.get("/chats", verifyAdmin, getChatLogs);
router.get("/letters", verifyAdmin, getLetters);
router.get("/secret", verifyAdmin, getSecret);

module.exports = router;
