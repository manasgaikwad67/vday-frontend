const router = require("express").Router();
const { getQuestions, verifyAnswers, updateSecret } = require("../controllers/secretController");
const { verifyEntry, verifyAdmin } = require("../middleware/auth");

router.get("/questions", verifyEntry, getQuestions);
router.post("/verify", verifyEntry, verifyAnswers);
router.put("/", verifyAdmin, updateSecret);

module.exports = router;
