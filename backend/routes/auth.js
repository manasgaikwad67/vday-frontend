const router = require("express").Router();
const { verifyEntry, adminLogin } = require("../controllers/authController");

router.post("/entry", verifyEntry);
router.post("/admin-login", adminLogin);

module.exports = router;
