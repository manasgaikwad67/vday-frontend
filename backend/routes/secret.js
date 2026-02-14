const router = require("express").Router();
const { getQuestions, verifyAnswers, updateSecret, getSecret } = require("../controllers/secretController");
const { verifyAccess, verifyCreator } = require("../middleware/auth");

router.get("/questions", verifyAccess, getQuestions);
router.post("/verify", verifyAccess, verifyAnswers);
router.get("/", verifyCreator, getSecret);
router.put("/", verifyCreator, updateSecret);

module.exports = router;
