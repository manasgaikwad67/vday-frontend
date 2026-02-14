const router = require("express").Router();
const { analyze } = require("../controllers/moodController");
const { verifyAccess } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyAccess, aiLimiter, analyze);

module.exports = router;
