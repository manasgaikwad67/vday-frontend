const router = require("express").Router();
const { predict } = require("../controllers/futureController");
const { verifyEntry } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyEntry, aiLimiter, predict);

module.exports = router;
