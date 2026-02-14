const router = require("express").Router();
const { generate, getAll, getById, remove } = require("../controllers/letterController");
const { verifyAccess, verifyCreator } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");

router.post("/generate", verifyAccess, aiLimiter, generate);
router.get("/", verifyAccess, getAll);
router.get("/:id", verifyAccess, getById);
router.delete("/:id", verifyCreator, remove);

module.exports = router;
