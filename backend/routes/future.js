const router = require("express").Router();
const { predict } = require("../controllers/futureController");
const { verifyAccess } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/", verifyAccess, aiLimiter, predict);

module.exports = router;
