const router = require("express").Router();
const { generate, getAll, getById, remove } = require("../controllers/letterController");
const { verifyEntry, verifyAdmin } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/generate", verifyEntry, aiLimiter, generate);
router.get("/", verifyEntry, getAll);
router.get("/:id", verifyEntry, getById);
router.delete("/:id", verifyAdmin, remove);

module.exports = router;
