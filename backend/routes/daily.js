const router = require("express").Router();
const { getToday, getAll } = require("../controllers/dailyController");
const { verifyEntry } = require("../middleware/auth");

router.get("/today", verifyEntry, getToday);
router.get("/", verifyEntry, getAll);

module.exports = router;
