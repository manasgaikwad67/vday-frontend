const router = require("express").Router();
const { create, getAll, update, remove, upload } = require("../controllers/memoryController");
const { verifyEntry, verifyAdmin } = require("../middleware/auth");

router.get("/", verifyEntry, getAll);
router.post("/", verifyAdmin, upload.single("image"), create);
router.put("/:id", verifyAdmin, upload.single("image"), update);
router.delete("/:id", verifyAdmin, remove);

module.exports = router;
