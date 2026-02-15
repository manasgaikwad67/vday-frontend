const router = require("express").Router();
const { analyze } = require("../controllers/moodController");
const { verifyEntry } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyEntry, aiLimiter, analyze);

module.exports = router;
