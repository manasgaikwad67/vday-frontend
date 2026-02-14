const router = require("express").Router();
const { getToday, getAll } = require("../controllers/dailyController");
const { verifyAccess } = require("../middleware/auth");

router.get("/today", verifyAccess, getToday);
router.get("/", verifyAccess, getAll);

module.exports = router;
