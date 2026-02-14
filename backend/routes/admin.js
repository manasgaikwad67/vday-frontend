const router = require("express").Router();
const { verifyCreator } = require("../middleware/auth");
const { getDashboard, getChatLogs, getLetters, getSecret } = require("../controllers/adminController");

router.get("/dashboard", verifyCreator, getDashboard);
router.get("/chats", verifyCreator, getChatLogs);
router.get("/letters", verifyCreator, getLetters);
router.get("/secret", verifyCreator, getSecret);

module.exports = router;
